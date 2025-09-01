import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Send,
  Psychology,
  History,
  AutoAwesome,
  ExpandMore,
  ContentCopy,
  CheckCircle,
  Error,
  Pending
} from '@mui/icons-material';
import { aiAssistant, AICommand } from '../services/aiAssistantService';

const AdminAIAssistantPage: React.FC = () => {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState<AICommand[]>([]);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load command history
    setCommandHistory(aiAssistant.getCommandHistory());
  }, []);

  const handleSubmitCommand = async () => {
    if (!command.trim() || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const result = await aiAssistant.processCommand(command);
      setCommandHistory(prev => [result, ...prev]);
      setCommand('');
    } catch (error) {
      console.error('Command failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitCommand();
    }
  };

  const handleExampleClick = (exampleCommand: string) => {
    setCommand(exampleCommand);
    inputRef.current?.focus();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" fontSize="small" />;
      case 'error':
        return <Error color="error" fontSize="small" />;
      case 'pending':
        return <Pending color="warning" fontSize="small" />;
      default:
        return null;
    }
  };

  const formatResult = (result: any) => {
    if (result.error) {
      return (
        <Alert severity="error" sx={{ mt: 1 }}>
          {result.error}
        </Alert>
      );
    }

    if (result.message) {
      return (
        <Alert severity="success" sx={{ mt: 1 }}>
          {result.message}
        </Alert>
      );
    }

    if (result.data && Array.isArray(result.data)) {
      return (
        <TableContainer component={Paper} sx={{ mt: 1, maxHeight: 400 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {result.data.length > 0 && Object.keys(result.data[0]).map((key) => (
                  <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {result.data.slice(0, 10).map((row: any, index: number) => (
                <TableRow key={index}>
                  {Object.values(row).map((value: any, cellIndex: number) => (
                    <TableCell key={cellIndex}>
                      {typeof value === 'string' && value.length > 50 
                        ? `${value.substring(0, 50)}...` 
                        : String(value)
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {result.data.length > 10 && (
            <Alert severity="info" sx={{ m: 1 }}>
              Showing first 10 of {result.data.length} results
            </Alert>
          )}
        </TableContainer>
      );
    }

    return (
      <Paper sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5' }}>
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </Paper>
    );
  };

  const exampleCommands = aiAssistant.getExampleCommands();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Psychology color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            AI Database Assistant
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Use natural language to query and manage your database. 
          Ask questions, update data, or find insights with simple commands.
        </Typography>
      </Box>

      {/* Command Input */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome color="primary" />
            Enter Command
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={3}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Show all products with rating > 4"
              variant="outlined"
              disabled={isProcessing}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white'
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubmitCommand}
              disabled={!command.trim() || isProcessing}
              sx={{ 
                minWidth: 120,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {isProcessing ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Send />
              )}
              {isProcessing ? 'Processing...' : 'Execute'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Example Commands */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Example Commands
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {exampleCommands.map((example, index) => (
              <Chip
                key={index}
                label={example}
                onClick={() => handleExampleClick(example)}
                variant="outlined"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Command History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History color="primary" />
            Command History
          </Typography>

          {commandHistory.length === 0 ? (
            <Alert severity="info">
              No commands executed yet. Try running an example command above!
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {commandHistory.map((cmd, index) => (
                <Accordion key={cmd.id} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      {getStatusIcon(cmd.status)}
                      <Typography sx={{ flexGrow: 1, fontFamily: 'monospace' }}>
                        {cmd.command}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cmd.timestamp.toLocaleTimeString()}
                      </Typography>
                      <Tooltip title={copiedCommand === cmd.command ? "Copied!" : "Copy command"}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(cmd.command);
                          }}
                        >
                          {copiedCommand === cmd.command ? (
                            <CheckCircle color="success" fontSize="small" />
                          ) : (
                            <ContentCopy fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Divider sx={{ mb: 2 }} />
                    {formatResult(cmd.result)}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminAIAssistantPage;
