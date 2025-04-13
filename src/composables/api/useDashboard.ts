import { ref, onMounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { httpClient } from '../../utils/httpClient';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  totalBooks: number;
  newBooksThisMonth: number;
  lastUpdate: string;
}

interface RecentItem {
  id: string;
  title: string;
  createdAt: string;
  slug?: string;
}

export function useDashboard() {
  const stats = ref<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    totalBooks: 0,
    newBooksThisMonth: 0,
    lastUpdate: new Date().toISOString(),
  });

  const recentArticles = ref<RecentItem[]>([]);
  const recentBooks = ref<RecentItem[]>([]);

  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    try {
      // En un entorno real, esto se obtendría de una API
      // Por ahora simulamos la llamada a la API
      const articlesResponse = await httpClient.get('/blog/articles', {
        params: { page: 1, limit: 1 }
      });
      
      const booksResponse = await httpClient.get('/blog/books', {
        params: { page: 1, limit: 1 }
      });

      return {
        totalArticles: articlesResponse.data?.meta?.totalItems || 0,
        publishedArticles: Math.floor((articlesResponse.data?.meta?.totalItems || 0) * 0.7), // Simulación
        totalBooks: booksResponse.data?.meta?.totalItems || 0,
        newBooksThisMonth: Math.floor((booksResponse.data?.meta?.totalItems || 0) * 0.2), // Simulación
        lastUpdate: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return stats.value;
    }
  };

  const fetchRecentArticles = async (): Promise<RecentItem[]> => {
    try {
      const response = await httpClient.get('/blog/articles', {
        params: { page: 1, limit: 5, sort: 'createdAt:desc' }
      });
      
      return (response.data?.items || []).map((article: any) => ({
        id: article.id,
        title: article.title,
        createdAt: article.createdAt,
        slug: article.slug
      }));
    } catch (error) {
      console.error('Error fetching recent articles:', error);
      return [];
    }
  };

  const fetchRecentBooks = async (): Promise<RecentItem[]> => {
    try {
      const response = await httpClient.get('/blog/books', {
        params: { page: 1, limit: 5, sort: 'createdAt:desc' }
      });
      
      return (response.data?.items || []).map((book: any) => ({
        id: book.id,
        title: book.title,
        createdAt: book.createdAt
      }));
    } catch (error) {
      console.error('Error fetching recent books:', error);
      return [];
    }
  };

  const statsQuery = useQuery(['dashboardStats'], fetchDashboardStats, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      stats.value = data;
    }
  });

  const articlesQuery = useQuery(['recentArticles'], fetchRecentArticles, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      recentArticles.value = data;
    }
  });

  const booksQuery = useQuery(['recentBooks'], fetchRecentBooks, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      recentBooks.value = data;
    }
  });

  return {
    stats,
    recentArticles,
    recentBooks,
    isLoading: computed(() => 
      statsQuery.isLoading.value || 
      articlesQuery.isLoading.value || 
      booksQuery.isLoading.value
    ),
    isError: computed(() => 
      statsQuery.isError.value || 
      articlesQuery.isError.value || 
      booksQuery.isError.value
    ),
    refetch: () => {
      statsQuery.refetch();
      articlesQuery.refetch();
      booksQuery.refetch();
    }
  };
}
