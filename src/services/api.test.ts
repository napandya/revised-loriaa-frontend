/**
 * API Service Tests
 * Tests for API service transformations and helper functions
 */

import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { callLogsService } from './api';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

describe('callLogsService', () => {
  describe('getCallLogs', () => {
    it('should transform backend snake_case response to frontend camelCase format', async () => {
      const callLogs = await callLogsService.getCallLogs();

      expect(callLogs).toHaveLength(2);
      
      // Verify first log
      const firstLog = callLogs[0];
      expect(firstLog).toHaveProperty('id', '1');
      expect(firstLog).toHaveProperty('botName', 'Customer Support Bot');
      expect(firstLog).toHaveProperty('phoneNumber', '+1 (555) 987-6543');
      expect(firstLog).toHaveProperty('duration', '5:30');
      expect(firstLog).toHaveProperty('cost', '$0.99'); // 330 seconds = 5.5 minutes, 5.5 * $0.18/min = $0.99
      expect(firstLog).toHaveProperty('status', 'completed');
      expect(firstLog).toHaveProperty('timestamp');
      
      // Verify timestamp is formatted (should contain comma and AM/PM)
      expect(firstLog.timestamp).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should format duration correctly for various values', async () => {
      // Mock with specific duration values
      server.use(
        http.get('http://localhost:8000/api/v1/call-logs', async () => {
          return HttpResponse.json([
            {
              id: '1',
              bot_id: 'bot-1',
              bot_name: 'Test Bot',
              phone_number: '+1234567890',
              start_time: '2024-01-15T10:30:00Z',
              duration_seconds: 65, // Should be 1:05
              status: 'completed',
              call_type: 'outbound',
            },
            {
              id: '2',
              bot_id: 'bot-2',
              bot_name: 'Test Bot 2',
              phone_number: '+1234567890',
              start_time: '2024-01-15T10:30:00Z',
              duration_seconds: 600, // Should be 10:00
              status: 'completed',
              call_type: 'outbound',
            },
            {
              id: '3',
              bot_id: 'bot-3',
              bot_name: 'Test Bot 3',
              phone_number: '+1234567890',
              start_time: '2024-01-15T10:30:00Z',
              duration_seconds: 3661, // Should be 61:01
              status: 'completed',
              call_type: 'outbound',
            },
          ]);
        })
      );

      const callLogs = await callLogsService.getCallLogs();

      expect(callLogs[0].duration).toBe('1:05');
      expect(callLogs[1].duration).toBe('10:00');
      expect(callLogs[2].duration).toBe('61:01');
    });

    it('should calculate cost correctly based on duration', async () => {
      // Mock with specific duration for cost calculation
      server.use(
        http.get('http://localhost:8000/api/v1/call-logs', async () => {
          return HttpResponse.json([
            {
              id: '1',
              bot_id: 'bot-1',
              bot_name: 'Test Bot',
              phone_number: '+1234567890',
              start_time: '2024-01-15T10:30:00Z',
              duration_seconds: 60, // 1 minute = $0.18
              status: 'completed',
              call_type: 'outbound',
            },
            {
              id: '2',
              bot_id: 'bot-2',
              bot_name: 'Test Bot 2',
              phone_number: '+1234567890',
              start_time: '2024-01-15T10:30:00Z',
              duration_seconds: 300, // 5 minutes = $0.90
              status: 'completed',
              call_type: 'outbound',
            },
          ]);
        })
      );

      const callLogs = await callLogsService.getCallLogs();

      expect(callLogs[0].cost).toBe('$0.18');
      expect(callLogs[1].cost).toBe('$0.90');
    });

    it('should handle empty call logs array', async () => {
      server.use(
        http.get('http://localhost:8000/api/v1/call-logs', async () => {
          return HttpResponse.json([]);
        })
      );

      const callLogs = await callLogsService.getCallLogs();

      expect(callLogs).toHaveLength(0);
      expect(callLogs).toEqual([]);
    });
  });

  describe('getCallLogById', () => {
    it('should transform single call log response correctly', async () => {
      const callLog = await callLogsService.getCallLogById('1');

      expect(callLog).toHaveProperty('id', '1');
      expect(callLog).toHaveProperty('botName', 'Customer Support Bot');
      expect(callLog).toHaveProperty('phoneNumber', '+1 (555) 987-6543');
      expect(callLog).toHaveProperty('duration', '5:30');
      expect(callLog).toHaveProperty('cost', '$0.99'); // 330 seconds = 5.5 minutes, 5.5 * $0.18/min = $0.99
      expect(callLog).toHaveProperty('status', 'completed');
      expect(callLog).toHaveProperty('timestamp');
      
      // Verify timestamp is formatted
      expect(callLog.timestamp).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });
});
