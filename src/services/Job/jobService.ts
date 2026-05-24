import { jobs } from './mockJobs'

export type GetJobList = {
  page?: number
  limit?: number
  search?: string
}

export type GetJobDetail = {
  id: string
}

export const getJobList = async ({ page = 1, limit = 10, search }: GetJobList) => {
  let filteredJobs = jobs

  if (search) {
    filteredJobs = jobs.filter(
      job =>
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase()) ||
        job.description?.toLowerCase().includes(search.toLowerCase()),
    )
  }

  return {
    code: 200,
    data: {
      hits: filteredJobs.slice((page - 1) * limit, page * limit),
      pagination: {
        totalItems: filteredJobs.length,
        totalPages: Math.ceil(filteredJobs.length / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    },
  }
}

export const getJobDetail = async ({ id }: GetJobDetail) => {
  const job = jobs.find(job => job.id === id)
  console.log('Job detail fetched:', job)

  return job
}
