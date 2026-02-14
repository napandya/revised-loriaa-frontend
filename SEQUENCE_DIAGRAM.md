# Frontend — Sequence Diagrams

All diagrams use [Mermaid](https://mermaid.js.org/) syntax and render natively on GitHub.

---

## 1. Application Bootstrap & Routing

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Vite as Vite Dev Server
    participant App as App.tsx
    participant Providers as Context Providers<br/>(Theme, Notification)
    participant Router as React Router
    participant AuthStore as Zustand Auth Store
    participant Page as Lazy-loaded Page

    User->>Browser: Navigate to http://localhost:3000
    Browser->>Vite: Request index.html
    Vite-->>Browser: HTML + JS bundles
    Browser->>App: Mount <App />
    App->>Providers: Wrap with ThemeProvider + NotificationProvider
    Providers->>Router: <BrowserRouter>
    Router->>Router: Match route path
    Router->>AuthStore: Check isAuthenticated
    alt Not authenticated
        AuthStore-->>Router: false
        Router->>Browser: Redirect to /login
    else Authenticated
        AuthStore-->>Router: true
        Router->>Page: Suspense → lazy import page chunk
        Page-->>Browser: Render page inside AppLayout<br/>(Sidebar + Header + Main)
    end
    Browser-->>User: Display page
```

---

## 2. Login Flow

```mermaid
sequenceDiagram
    actor User
    participant LoginPage as Login Page
    participant Axios as Axios Instance
    participant API as Backend API
    participant AuthStore as Zustand Auth Store
    participant Storage as localStorage
    participant Router as React Router

    User->>LoginPage: Enter email + password
    User->>LoginPage: Click "Sign In"
    LoginPage->>Axios: POST /api/v1/auth/login (form data)
    Note over Axios: Request Interceptor<br/>adds X-Correlation-ID
    Axios->>API: HTTP POST
    API-->>Axios: {access_token, token_type}
    Note over Axios: Response Interceptor<br/>logs status + correlationId
    Axios-->>LoginPage: Response data
    LoginPage->>Storage: localStorage.setItem("token", jwt)
    LoginPage->>AuthStore: setAuth(user, token)
    AuthStore-->>Router: isAuthenticated = true
    Router->>Router: Navigate to /dashboard
    Router-->>User: Dashboard page rendered
```

---

## 3. Dashboard Data Loading

```mermaid
sequenceDiagram
    actor User
    participant Dashboard as DashboardPage
    participant Axios as Axios Instance
    participant API as Backend API
    participant Components as MetricCard / AnalyticsChart

    User->>Dashboard: Navigate to /dashboard
    Dashboard->>Dashboard: useEffect → fetch data

    par Parallel API calls
        Dashboard->>Axios: GET /api/v1/dashboard/metrics
        Dashboard->>Axios: GET /api/v1/dashboard/analytics
    end

    Note over Axios: Interceptor injects<br/>Bearer token + correlationId

    Axios->>API: GET /dashboard/metrics
    API-->>Axios: {total_calls, active_bots, revenue, ...}
    Axios->>API: GET /dashboard/analytics
    API-->>Axios: {time_series_data: [...]}

    Axios-->>Dashboard: Metrics response
    Axios-->>Dashboard: Analytics response

    Dashboard->>Components: Pass data as props
    Components-->>User: Render KPI cards + charts
```

---

## 4. AI Agent Chat Interaction

```mermaid
sequenceDiagram
    actor User
    participant AgentPage as Agent Page<br/>(Leasing/Marketing/Property)
    participant State as Component State
    participant Axios as Axios Instance
    participant API as Backend API
    participant Agent as AI Agent (Gemini)

    User->>AgentPage: Type message in chat input
    User->>AgentPage: Press Send
    AgentPage->>State: Add user message to chat history
    AgentPage->>State: Set loading = true
    AgentPage->>Axios: POST /api/v1/agents/{type}/execute<br/>{message, context}
    Axios->>API: Authenticated request
    API->>Agent: Process with Gemini + tools
    Agent-->>API: AI response
    API-->>Axios: {response, actions_taken, agent_type}
    Axios-->>AgentPage: Response data
    AgentPage->>State: Add agent response to chat history
    AgentPage->>State: Set loading = false
    State-->>User: Display conversation with AI response
```

---

## 5. Ad Copy Generation (Marketing Agent)

```mermaid
sequenceDiagram
    actor User
    participant AdCopyTab as Ad Copy Tab<br/>(MarketingAgentPage)
    participant Axios as Axios Instance
    participant API as Backend API
    participant OpenAI as OpenAI GPT-4o

    User->>AdCopyTab: Select platform (Facebook/Instagram/Google)
    User->>AdCopyTab: Select objective (Awareness/Leads/Traffic)
    User->>AdCopyTab: Enter property name + special offers
    User->>AdCopyTab: Set number of variations
    User->>AdCopyTab: Click "Generate Ad Copy"
    AdCopyTab->>AdCopyTab: Set generating = true
    AdCopyTab->>Axios: POST /api/v1/ad-copy/generate<br/>{platform, objective, property_details, num_variations}
    Axios->>API: Authenticated request
    API->>OpenAI: Generate ad copy with platform specs
    OpenAI-->>API: JSON with ad variations
    API-->>Axios: {variations: [{headline, body, cta},...]}
    Axios-->>AdCopyTab: Ad copy response
    AdCopyTab->>AdCopyTab: Set generating = false
    AdCopyTab-->>User: Display variations in cards

    User->>AdCopyTab: Click copy icon on a variation
    AdCopyTab->>AdCopyTab: navigator.clipboard.writeText()
    AdCopyTab-->>User: "Copied!" toast notification
```

---

## 6. Lead Management Flow

```mermaid
sequenceDiagram
    actor User
    participant LeadsPage as Leads Page
    participant Axios as Axios Instance
    participant API as Backend API
    participant Toast as Toast Notification

    Note over User,Toast: Load Leads
    User->>LeadsPage: Navigate to /leads
    LeadsPage->>Axios: GET /api/v1/leads?page=1&status=all
    Axios->>API: Authenticated request
    API-->>Axios: {leads: [...], total, page}
    Axios-->>LeadsPage: Lead list
    LeadsPage-->>User: Render lead table

    Note over User,Toast: Create Lead
    User->>LeadsPage: Click "Add Lead" → fill form
    LeadsPage->>Axios: POST /api/v1/leads<br/>{name, email, phone, source}
    Axios->>API: Authenticated request
    API-->>Axios: 201 Created + lead object
    Axios-->>LeadsPage: New lead
    LeadsPage->>LeadsPage: Prepend to lead list
    LeadsPage->>Toast: "Lead created successfully"
    Toast-->>User: Green toast notification

    Note over User,Toast: Update Status
    User->>LeadsPage: Drag lead to new pipeline stage
    LeadsPage->>Axios: PUT /api/v1/leads/{id}<br/>{status: "qualified"}
    Axios->>API: Authenticated request
    API-->>Axios: Updated lead
    Axios-->>LeadsPage: Confirmation
    LeadsPage-->>User: Lead moves to new column
```

---

## 7. Unified Inbox Flow

```mermaid
sequenceDiagram
    actor User
    participant InboxPage as Inbox Page
    participant Axios as Axios Instance
    participant API as Backend API

    User->>InboxPage: Navigate to /inbox
    InboxPage->>Axios: GET /api/v1/inbox
    Axios->>API: Fetch all conversations
    API-->>Axios: {conversations: [{id, lead, channel, last_message, unread},...]}
    Axios-->>InboxPage: Conversation list
    InboxPage-->>User: Render inbox sidebar

    User->>InboxPage: Click a conversation
    InboxPage->>Axios: GET /api/v1/inbox/{id}/messages
    Axios->>API: Fetch message thread
    API-->>Axios: {messages: [{sender, text, timestamp, channel},...]}
    Axios-->>InboxPage: Message history
    InboxPage-->>User: Display chat thread

    InboxPage->>Axios: PUT /api/v1/inbox/{id}/read
    Axios->>API: Mark as read
    API-->>Axios: 200 OK
    InboxPage->>InboxPage: Update unread badge count
```

---

## 8. Error Handling Flow

```mermaid
sequenceDiagram
    actor User
    participant Page as Any Page
    participant Axios as Axios Instance
    participant ErrorHandler as errorHandler.ts
    participant Logger as logger.ts
    participant Toast as Toast / ErrorBoundary
    participant AuthStore as Auth Store

    Page->>Axios: API request
    Axios->>Axios: Response interceptor catches error

    alt 401 Unauthorized
        Axios->>AuthStore: Clear token + user
        Axios->>Page: Redirect to /login
    else 403 Forbidden
        Axios->>ErrorHandler: classifyError(error)
        ErrorHandler->>Logger: logger.warn("Forbidden", context)
        ErrorHandler-->>Page: "Access denied" error
        Page->>Toast: Show warning toast
    else 422 Validation Error
        Axios->>ErrorHandler: extractErrorContext(error)
        ErrorHandler-->>Page: Field-level validation errors
        Page->>Page: Highlight invalid form fields
    else 500 Server Error
        Axios->>ErrorHandler: classifyError(error)
        ErrorHandler->>Logger: logger.error("Server error", context)
        ErrorHandler-->>Page: "Something went wrong"
        Page->>Toast: Show error toast
    else Network Error
        Axios->>ErrorHandler: classifyError(error)
        ErrorHandler->>Logger: logger.error("Network error")
        ErrorHandler-->>Page: "Unable to connect"
        Page->>Toast: Show connection error toast
    end

    Toast-->>User: Error message displayed
```

---

## 9. Theme & Notification Context Flow

```mermaid
sequenceDiagram
    participant App as App.tsx
    participant ThemeCtx as ThemeProvider
    participant NotifCtx as NotificationProvider
    participant Sidebar as Sidebar
    participant Bell as NotificationBell
    participant Toast as NotificationToast
    actor User

    App->>ThemeCtx: Wrap app tree
    App->>NotifCtx: Wrap app tree

    Note over User,Toast: Theme Toggle
    User->>Sidebar: Click dark mode toggle
    Sidebar->>ThemeCtx: toggleTheme()
    ThemeCtx->>ThemeCtx: Update CSS class on <html>
    ThemeCtx-->>User: UI switches dark ↔ light

    Note over User,Toast: Notification
    NotifCtx->>NotifCtx: Receive push / event
    NotifCtx->>Bell: Update unread count badge
    NotifCtx->>Toast: Show toast notification
    Toast-->>User: Toast appears (auto-dismiss)
    User->>Bell: Click bell icon
    Bell->>NotifCtx: markAllRead()
    Bell-->>User: Show notification dropdown
```
