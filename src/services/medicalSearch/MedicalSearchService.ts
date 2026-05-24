import { httpClient } from '@/services/apiClient'

// Types for medical search service
export interface MedicalSearchSuggestion {
  value: string
  category: string
  description?: string
}

export interface MedicalCondition {
  id: string
  name: string
  description: string
  specialty: string
  confidence: number
  symptoms: string[]
}

export interface MedicalAnalysisResult {
  conditions: MedicalCondition[]
  keywords: string[]
  relatedTerms: string[]
}

export interface GuidelineResult {
  id: string
  title: string
  summary: string
  source: string
  relevance: number
  url?: string
}

export interface ReferenceResult {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  abstract: string
  keywords: string[]
  doi?: string
  url?: string
}

export interface CourseResult {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  cmePoints: number
  level: string
  price?: number
  rating?: number
  url?: string
}

export interface MedicalSearchResults {
  guidelines: GuidelineResult[]
  references: ReferenceResult[]
  courses: CourseResult[]
}

export class MedicalSearchService {
  private readonly baseUrl = '/api/medical-search'

  /**
   * Get autocomplete suggestions for medical search
   */
  async getSuggestions(query: string): Promise<MedicalSearchSuggestion[]> {
    try {
      const response = await httpClient.get<{ suggestions: MedicalSearchSuggestion[] }>(
        `${this.baseUrl}/suggestions`,
        {
          params: { q: query },
        },
      )
      if (!response.data) return []
      if ('suggestions' in response.data) {
        return response.data.suggestions
      }
      return []
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      return []
    }
  }

  /**
   * Analyze medical query using LLM to extract conditions and symptoms
   */
  async analyzeMedicalQuery(query: string): Promise<MedicalAnalysisResult> {
    try {
      const response = await httpClient.post<MedicalAnalysisResult>(`${this.baseUrl}/analyze`, {
        query,
        language: 'vi',
      })
      if (!response.data) {
        throw new Error('Không có dữ liệu phản hồi')
      }
      // Handle both direct response and ListResponseData wrapper
      if (
        'conditions' in response.data &&
        'keywords' in response.data &&
        'relatedTerms' in response.data
      ) {
        return response.data as MedicalAnalysisResult
      } else {
        // If wrapped in ListResponseData, return empty results for now
        return {
          conditions: [],
          keywords: [],
          relatedTerms: [],
        }
      }
    } catch (error) {
      console.error('Error analyzing medical query:', error)
      throw new Error('Không thể phân tích truy vấn y khoa')
    }
  }

  /**
   * Get search results from LLM for guidelines, references, and courses
   */
  async getSearchResults(query: string, keywords?: string[]): Promise<MedicalSearchResults> {
    try {
      const response = await httpClient.post<MedicalSearchResults>(`${this.baseUrl}/search`, {
        query,
        keywords: keywords || [],
        language: 'vi',
      })
      if (!response.data) {
        throw new Error('Không có dữ liệu phản hồi')
      }
      // Handle both direct response and ListResponseData wrapper
      if (
        'guidelines' in response.data &&
        'references' in response.data &&
        'courses' in response.data
      ) {
        return response.data as MedicalSearchResults
      } else {
        // If wrapped in ListResponseData, return empty results for now
        return {
          guidelines: [],
          references: [],
          courses: [],
        }
      }
    } catch (error) {
      console.error('Error fetching search results:', error)
      throw new Error('Không thể tìm kiếm kết quả')
    }
  }

  /**
   * Get guidelines based on medical conditions
   */
  async getGuidelines(conditions: string[], query: string): Promise<GuidelineResult[]> {
    try {
      const response = await httpClient.post<{ guidelines: GuidelineResult[] }>(
        `${this.baseUrl}/guidelines`,
        {
          conditions,
          query,
          language: 'vi',
        },
      )
      if (!response.data) return []
      if ('guidelines' in response.data) {
        return response.data.guidelines
      }
      return []
    } catch (error) {
      console.error('Error fetching guidelines:', error)
      return []
    }
  }

  /**
   * Get references and research papers
   */
  async getReferences(keywords: string[], query: string): Promise<ReferenceResult[]> {
    try {
      const response = await httpClient.post<{ references: ReferenceResult[] }>(
        `${this.baseUrl}/references`,
        {
          keywords,
          query,
          language: 'vi',
        },
      )
      if (!response.data) return []
      if ('references' in response.data) {
        return response.data.references
      }
      return []
    } catch (error) {
      console.error('Error fetching references:', error)
      return []
    }
  }

  /**
   * Get CME courses related to the medical query
   */
  async getCourses(keywords: string[], query: string): Promise<CourseResult[]> {
    try {
      const response = await httpClient.post<{ courses: CourseResult[] }>(
        `${this.baseUrl}/courses`,
        {
          keywords,
          query,
          language: 'vi',
        },
      )
      if (!response.data) return []
      if ('courses' in response.data) {
        return response.data.courses
      }
      return []
    } catch (error) {
      console.error('Error fetching courses:', error)
      return []
    }
  }

  /**
   * Submit feedback for search results quality
   */
  async submitFeedback(
    query: string,
    resultType: 'condition' | 'guideline' | 'reference' | 'course',
    resultId: string,
    feedback: 'helpful' | 'not_helpful' | 'irrelevant',
    comment?: string,
  ): Promise<void> {
    try {
      await httpClient.post(`${this.baseUrl}/feedback`, {
        query,
        resultType,
        resultId,
        feedback,
        comment,
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  /**
   * Get popular medical searches
   */
  async getPopularSearches(): Promise<string[]> {
    try {
      const response = await httpClient.get<{ searches: string[] }>(`${this.baseUrl}/popular`)
      if (!response.data) return []
      if ('searches' in response.data) {
        return response.data.searches
      }
      return []
    } catch (error) {
      console.error('Error fetching popular searches:', error)
      return []
    }
  }

  /**
   * Get search history for authenticated user
   */
  async getSearchHistory(): Promise<string[]> {
    try {
      const response = await httpClient.get<{ history: string[] }>(`${this.baseUrl}/history`)
      if (!response.data) return []
      if ('history' in response.data) {
        return response.data.history
      }
      return []
    } catch (error) {
      console.error('Error fetching search history:', error)
      return []
    }
  }
}

// Export singleton instance
export const medicalSearchService = new MedicalSearchService()
