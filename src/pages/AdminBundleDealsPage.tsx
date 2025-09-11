import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Product } from '../types';
import { BundleDeal } from '../types/bundleDeal';

interface BundleDealFormData {
  product_id: string;
  bundle_type: 'get2' | 'get3' | 'get4' | 'get5';
  discount_percentage: number;
  is_active: boolean;
}

const AdminBundleDealsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundleDeals, setBundleDeals] = useState<BundleDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<BundleDeal | null>(null);
  const [formData, setFormData] = useState<BundleDealFormData>({
    product_id: '',
    bundle_type: 'get2',
    discount_percentage: 0,
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('title');

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch bundle deals with product info
      const { data: dealsData, error: dealsError } = await supabase
        .from('bundle_deals')
        .select(`
          *,
        products (
          id,
          name,
          price,
          image
        )
        `)
        .order('created_at', { ascending: false });

      if (dealsError) throw dealsError;
      setBundleDeals(dealsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Lỗi khi tải dữ liệu: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDeal) {
        // Update existing deal
        const { error } = await supabase
          .from('bundle_deals')
          .update({
            bundle_type: formData.bundle_type,
            discount_percentage: formData.discount_percentage,
            is_active: formData.is_active
          })
          .eq('id', editingDeal.id);

        if (error) throw error;
        alert('Cập nhật bundle deal thành công!');
      } else {
        // Create new deal
        const { error } = await supabase
          .from('bundle_deals')
          .insert([formData]);

        if (error) throw error;
        alert('Tạo bundle deal thành công!');
      }

      setShowForm(false);
      setEditingDeal(null);
      setFormData({
        product_id: '',
        bundle_type: 'get2',
        discount_percentage: 0,
        is_active: true
      });
      fetchData();
    } catch (error) {
      console.error('Error saving bundle deal:', error);
      alert('Lỗi khi lưu bundle deal: ' + (error as Error).message);
    }
  };

  const handleEdit = (deal: BundleDeal) => {
    setEditingDeal(deal);
    setFormData({
      product_id: deal.product_id,
      bundle_type: deal.bundle_type,
      discount_percentage: deal.discount_percentage,
      is_active: deal.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bundle deal này?')) return;

    try {
      const { error } = await supabase
        .from('bundle_deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Xóa bundle deal thành công!');
      fetchData();
    } catch (error) {
      console.error('Error deleting bundle deal:', error);
      alert('Lỗi khi xóa bundle deal: ' + (error as Error).message);
    }
  };

  const calculateSavings = (price: number, quantity: number, discountPercentage: number) => {
    const totalPrice = price * quantity;
    const discountAmount = (totalPrice * discountPercentage) / 100;
    const finalPrice = totalPrice - discountAmount;
    return {
      totalPrice,
      discountAmount,
      finalPrice,
      savings: discountAmount
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Bundle Deals</h1>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm Bundle Deal
              </button>
            </div>
          </div>

          <div className="p-6">
            {bundleDeals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có bundle deal nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại Deal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Giảm giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá mẫu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bundleDeals.map((deal) => {
                      const product = deal.products as Product;
                      const savings = calculateSavings(product.price, parseInt(deal.bundle_type.replace('get', '')), deal.discount_percentage);
                      
                      return (
                        <tr key={deal.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={product.image || '/placeholder-product.jpg'}
                                alt={product.name}
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ${product.price}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {deal.bundle_type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {deal.discount_percentage}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="text-gray-500 line-through">
                                ${savings.totalPrice.toFixed(2)}
                              </div>
                              <div className="font-semibold text-green-600">
                                ${savings.finalPrice.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Tiết kiệm: ${savings.savings.toFixed(2)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              deal.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {deal.is_active ? 'Hoạt động' : 'Tạm dừng'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(deal)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(deal.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingDeal ? 'Chỉnh sửa Bundle Deal' : 'Thêm Bundle Deal mới'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sản phẩm
                    </label>
                    <select
                      value={formData.product_id}
                      onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn sản phẩm</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại Deal
                    </label>
                    <select
                      value={formData.bundle_type}
                      onChange={(e) => setFormData({...formData, bundle_type: e.target.value as any})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="get2">Get 2 (Mua 2)</option>
                      <option value="get3">Get 3 (Mua 3)</option>
                      <option value="get4">Get 4 (Mua 4)</option>
                      <option value="get5">Get 5 (Mua 5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      % Giảm giá
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({...formData, discount_percentage: parseFloat(e.target.value) || 0})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Kích hoạt deal
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingDeal(null);
                        setFormData({
                          product_id: '',
                          bundle_type: 'get2',
                          discount_percentage: 0,
                          is_active: true
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editingDeal ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBundleDealsPage;
