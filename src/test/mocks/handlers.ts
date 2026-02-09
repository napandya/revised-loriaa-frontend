/**
 * MSW Request Handlers
 * Mock API endpoints for testing
 */

import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:8000';

export const handlers = [
  // Authentication endpoints
  http.post(`${API_URL}/api/v1/auth/login`, async ({ request }) => {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const username = params.get('username');
    const password = params.get('password');

    if (username === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
      });
    }

    return HttpResponse.json(
      { detail: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/api/v1/auth/register`, async () => {
    return HttpResponse.json({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    });
  }),

  http.get(`${API_URL}/api/v1/auth/me`, async () => {
    return HttpResponse.json({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
    });
  }),

  // Bots endpoints
  http.get(`${API_URL}/api/v1/bots`, async () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Customer Support Bot',
        hipaaCompliant: true,
        language: 'English',
        status: 'active',
        greeting: 'Hello! How can I help you today?',
        prompt: 'You are a helpful customer support assistant.',
        voice: 'alloy',
        model: 'gpt-4',
        phoneNumber: '+1 (555) 123-4567',
      },
      {
        id: '2',
        name: 'Sales Bot',
        hipaaCompliant: false,
        language: 'English',
        status: 'inactive',
        greeting: 'Welcome! Interested in our products?',
        prompt: 'You are a sales assistant.',
        voice: 'nova',
        model: 'gpt-3.5-turbo',
      },
    ]);
  }),

  http.get(`${API_URL}/api/v1/bots/:id`, async ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: 'Customer Support Bot',
      hipaaCompliant: true,
      language: 'English',
      status: 'active',
      greeting: 'Hello! How can I help you today?',
      prompt: 'You are a helpful customer support assistant.',
      voice: 'alloy',
      model: 'gpt-4',
      phoneNumber: '+1 (555) 123-4567',
    });
  }),

  http.post(`${API_URL}/api/v1/bots`, async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: 'new-bot-id',
      ...body,
    });
  }),

  http.put(`${API_URL}/api/v1/bots/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as any;
    return HttpResponse.json({
      id,
      name: 'Customer Support Bot',
      hipaaCompliant: true,
      language: 'English',
      status: 'active',
      greeting: 'Hello! How can I help you today?',
      prompt: 'You are a helpful customer support assistant.',
      voice: 'alloy',
      model: 'gpt-4',
      ...body,
    });
  }),

  http.delete(`${API_URL}/api/v1/bots/:id`, async () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Team members endpoints
  http.get(`${API_URL}/api/v1/teams`, async () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        active: true,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Developer',
        active: true,
      },
    ]);
  }),

  http.post(`${API_URL}/api/v1/teams`, async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: 'new-member-id',
      active: true,
      ...body,
    });
  }),

  http.put(`${API_URL}/api/v1/teams/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as any;
    return HttpResponse.json({
      id,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      active: true,
      ...body,
    });
  }),

  http.delete(`${API_URL}/api/v1/teams/:id`, async () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Call logs endpoints
  http.get(`${API_URL}/api/v1/call-logs`, async () => {
    // Return backend format (snake_case with raw values) to match real API
    return HttpResponse.json([
      {
        id: '1',
        bot_id: 'bot-1',
        bot_name: 'Customer Support Bot',
        phone_number: '+1 (555) 987-6543',
        start_time: '2024-01-15T10:30:00Z',
        duration_seconds: 330, // 5:30
        status: 'completed',
        call_type: 'outbound',
      },
      {
        id: '2',
        bot_id: 'bot-2',
        bot_name: 'Sales Bot',
        phone_number: '+1 (555) 123-7890',
        start_time: '2024-01-15T09:15:00Z',
        duration_seconds: 195, // 3:15
        status: 'failed',
        call_type: 'inbound',
      },
    ]);
  }),

  http.post(`${API_URL}/api/v1/call-logs`, async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: 'new-log-id',
      ...body,
    });
  }),

  http.get(`${API_URL}/api/v1/call-logs/:id`, async ({ params }) => {
    const { id } = params;
    // Return backend format (snake_case with raw values) to match real API
    return HttpResponse.json({
      id,
      bot_id: 'bot-1',
      bot_name: 'Customer Support Bot',
      phone_number: '+1 (555) 987-6543',
      start_time: '2024-01-15T10:30:00Z',
      duration_seconds: 330, // 5:30
      status: 'completed',
      call_type: 'outbound',
    });
  }),

  // Dashboard endpoints
  http.get(`${API_URL}/api/v1/dashboard/metrics`, async () => {
    // Return backend format (snake_case) to match real API
    return HttpResponse.json({
      total_bots: 2,
      active_bots: 2,
      total_calls: 1542,
      calls_this_month: 1542,
      calls_today: 45,
      total_duration_minutes: 257.0, // 15420 seconds / 60
      total_cost: 1850.4,
      success_rate: 100.0,
      average_duration_seconds: 600.0, // 10 minutes * 60 seconds
    });
  }),

  http.get(`${API_URL}/api/v1/dashboard/analytics`, async () => {
    return HttpResponse.json([
      { date: '2024-01-01', calls: 45, duration: 450, cost: 54.0 },
      { date: '2024-01-02', calls: 52, duration: 520, cost: 62.4 },
      { date: '2024-01-03', calls: 48, duration: 480, cost: 57.6 },
    ]);
  }),

  // Billing endpoints
  http.get(`${API_URL}/api/v1/billing/current`, async () => {
    return HttpResponse.json({
      current_month_cost: 1850.4,
      total_calls: 1542,
      total_duration: 15420,
      breakdown: [
        { category: 'API Calls', amount: 1200.5 },
        { category: 'Storage', amount: 350.9 },
        { category: 'Bandwidth', amount: 299.0 },
      ],
    });
  }),

  http.get(`${API_URL}/api/v1/billing/history`, async () => {
    return HttpResponse.json([
      { month: '2024-01', cost: 1850.4, calls: 1542 },
      { month: '2023-12', cost: 1650.2, calls: 1380 },
      { month: '2023-11', cost: 1720.8, calls: 1435 },
    ]);
  }),
];
