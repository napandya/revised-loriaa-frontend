import { create } from 'zustand';
import { Document, DocumentCategory, TriggerEvent, AgentAccess } from '@/types';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

interface DocumentStore {
  // State
  documents: Document[];
  selectedCategory: DocumentCategory | null;
  uploadProgress: number;
  isUploading: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDocuments: (category?: DocumentCategory) => Promise<void>;
  uploadDocument: (file: File, metadata: {
    category: DocumentCategory;
    triggerEvent?: TriggerEvent;
    agentAccess: AgentAccess[];
    expirationDate?: string;
  }) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  setSelectedCategory: (category: DocumentCategory | null) => void;
  searchDocuments: (query: string) => Document[];
}

/**
 * Document store managing document repository and uploads
 */
export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // Initial state
  documents: [],
  selectedCategory: null,
  uploadProgress: 0,
  isUploading: false,
  isLoading: false,
  error: null,

  /**
   * Fetch documents, optionally filtered by category
   */
  fetchDocuments: async (category) => {
    logger.info('Fetching documents', { 
      component: 'documentStore', 
      action: 'fetchDocuments',
      category 
    });
    
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API call
      // const documents = await documentService.getDocuments(category);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'Pet Policy 2024.pdf',
          category: DocumentCategory.LEASING_POLICIES,
          size: 245000,
          uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: 'John Anderson',
          triggerEvent: TriggerEvent.LEAD_INQUIRY,
          agentAccess: [AgentAccess.LEASING_AGENT],
          status: 'Active',
        },
        {
          id: '2',
          name: 'Application Checklist.pdf',
          category: DocumentCategory.TEMPLATES,
          size: 156000,
          uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: 'Sarah Chen',
          triggerEvent: TriggerEvent.APPLICATION_RECEIVED,
          agentAccess: [AgentAccess.LEASING_AGENT],
          status: 'Active',
        },
        {
          id: '3',
          name: 'Property Amenities Overview.pdf',
          category: DocumentCategory.PROPERTY_INFO,
          size: 3200000,
          uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: 'Michael Rodriguez',
          triggerEvent: TriggerEvent.TOUR_SCHEDULED,
          agentAccess: [AgentAccess.ALL_AGENTS],
          status: 'Active',
        },
        {
          id: '4',
          name: 'Fair Housing Compliance Guide.pdf',
          category: DocumentCategory.COMPLIANCE,
          size: 890000,
          uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: 'Admin',
          agentAccess: [AgentAccess.ALL_AGENTS],
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Active',
        },
        {
          id: '5',
          name: 'Lease Agreement Template OLD.pdf',
          category: DocumentCategory.TEMPLATES,
          size: 450000,
          uploadedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: 'Sarah Chen',
          status: 'Archived',
        },
      ];
      
      const filteredDocs = category 
        ? mockDocuments.filter(doc => doc.category === category)
        : mockDocuments;
      
      logger.info('Successfully fetched documents', { 
        component: 'documentStore', 
        action: 'fetchDocuments',
        count: filteredDocs.length,
        category 
      });
      
      set({ documents: filteredDocs, isLoading: false });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'documentStore',
        action: 'fetchDocuments',
        category,
      });
      
      set({ 
        error: classified.userMessage,
        isLoading: false 
      });
    }
  },

  /**
   * Upload document with progress tracking
   */
  uploadDocument: async (file, metadata) => {
    logger.info('Uploading document', { 
      component: 'documentStore', 
      action: 'uploadDocument',
      fileName: file.name,
      fileSize: file.size,
      category: metadata.category 
    });
    
    set({ isUploading: true, uploadProgress: 0, error: null });
    
    try {
      // TODO: Replace with actual API call with progress tracking
      // const document = await documentService.uploadDocument(file, metadata, (progress) => {
      //   set({ uploadProgress: progress });
      // });
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        set({ uploadProgress: progress });
      }
      
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        category: metadata.category,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Current User', // Should come from auth
        triggerEvent: metadata.triggerEvent,
        agentAccess: metadata.agentAccess,
        expirationDate: metadata.expirationDate,
        status: 'Active',
      };
      
      logger.info('Successfully uploaded document', { 
        component: 'documentStore', 
        action: 'uploadDocument',
        documentId: newDocument.id,
        fileName: file.name 
      });
      
      set(state => ({ 
        documents: [newDocument, ...state.documents],
        isUploading: false,
        uploadProgress: 0,
      }));
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'documentStore',
        action: 'uploadDocument',
        fileName: file.name,
      });
      
      set({ 
        error: classified.userMessage,
        isUploading: false,
        uploadProgress: 0,
      });
      throw error;
    }
  },

  /**
   * Delete document
   */
  deleteDocument: async (id) => {
    logger.info('Deleting document', { 
      component: 'documentStore', 
      action: 'deleteDocument',
      documentId: id 
    });
    
    try {
      // TODO: Replace with actual API call
      // await documentService.deleteDocument(id);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== id),
      }));
      
      logger.info('Successfully deleted document', { 
        component: 'documentStore', 
        action: 'deleteDocument',
        documentId: id 
      });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'documentStore',
        action: 'deleteDocument',
        documentId: id,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Update document metadata
   */
  updateDocument: async (id, updates) => {
    logger.info('Updating document', { 
      component: 'documentStore', 
      action: 'updateDocument',
      documentId: id 
    });
    
    try {
      // TODO: Replace with actual API call
      // await documentService.updateDocument(id, updates);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        documents: state.documents.map(doc => 
          doc.id === id ? { ...doc, ...updates } : doc
        ),
      }));
      
      logger.info('Successfully updated document', { 
        component: 'documentStore', 
        action: 'updateDocument',
        documentId: id 
      });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'documentStore',
        action: 'updateDocument',
        documentId: id,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Set selected category filter
   */
  setSelectedCategory: (category) => {
    logger.debug('Setting selected category', { 
      component: 'documentStore', 
      action: 'setSelectedCategory',
      category 
    });
    
    set({ selectedCategory: category });
    get().fetchDocuments(category || undefined);
  },

  /**
   * Search documents by name
   */
  searchDocuments: (query) => {
    logger.debug('Searching documents', { 
      component: 'documentStore', 
      action: 'searchDocuments',
      query 
    });
    
    const documents = get().documents;
    const lowercaseQuery = query.toLowerCase();
    
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowercaseQuery)
    );
  },
}));
