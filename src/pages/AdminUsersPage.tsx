import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { supabase } from '../utils/supabaseClient';

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isVerified?: boolean;
  created_at?: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [role, setRole] = useState<'admin' | 'user'>('user');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('id, name, email, role, is_verified, created_at');
      if (error) throw error;
      const rows: AdminUserRow[] = (data || []).map((u: any) => ({
        id: u.id,
        name: u.name || 'User',
        email: u.email,
        role: (u.role as 'admin' | 'user') || 'user',
        isVerified: !!u.is_verified,
        created_at: u.created_at
      }));
      setUsers(rows);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEdit = (row: AdminUserRow) => {
    setEditing(row);
    setRole(row.role);
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', editing.id);
      if (error) throw error;
      setEditOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (row: AdminUserRow) => {
    try {
      // Soft-delete or block user in real app; here we just remove profile
      const { error } = await supabase.from('profiles').delete().eq('id', row.id);
      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== row.id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        User Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Chip label={row.role} color={row.role === 'admin' ? 'error' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={row.isVerified ? 'Verified' : 'Unverified'} color={row.isVerified ? 'success' : 'warning'} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenEdit(row)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={role} label="Role" onChange={(e) => setRole(e.target.value as any)}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;


