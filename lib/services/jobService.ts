/**
 * Service layer for Job operations using Prisma
 */

import { prisma } from '../db';
import type { Job } from '@prisma/client';
import type { JobData, MovewareJob, transformJobForDatabase } from '../types/job';

class JobService {
  /**
   * Get a job by ID
   */
  async getJob(jobId: number): Promise<Job | null> {
    try {
      return await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          branding: true,
          inventoryItems: true,
          costingItems: true,
        },
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      return null;
    }
  }

  /**
   * Get all jobs for a brand
   */
  async getJobsByBrand(brandCode: string): Promise<Job[]> {
    try {
      return await prisma.job.findMany({
        where: { brandCode },
        include: {
          branding: true,
          inventoryItems: true,
          costingItems: true,
        },
        orderBy: { dateModified: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching jobs by brand:', error);
      return [];
    }
  }

  /**
   * Create or update a job from Moveware API data
   */
  async upsertJob(jobData: JobData): Promise<Job> {
    try {
      return await prisma.job.upsert({
        where: { id: jobData.id },
        create: jobData,
        update: jobData,
      });
    } catch (error) {
      console.error('Error upserting job:', error);
      throw error;
    }
  }

  /**
   * Delete a job
   */
  async deleteJob(jobId: number): Promise<void> {
    try {
      await prisma.job.delete({
        where: { id: jobId },
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  /**
   * Search jobs by customer name
   */
  async searchJobs(searchTerm: string): Promise<Job[]> {
    try {
      return await prisma.job.findMany({
        where: {
          OR: [
            { firstName: { contains: searchTerm, mode: 'insensitive' } },
            { lastName: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        include: {
          branding: true,
        },
        orderBy: { dateModified: 'desc' },
      });
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  }

  /**
   * Get jobs by date range
   */
  async getJobsByDateRange(startDate: Date, endDate: Date): Promise<Job[]> {
    try {
      return await prisma.job.findMany({
        where: {
          dateModified: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          branding: true,
        },
        orderBy: { dateModified: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching jobs by date range:', error);
      return [];
    }
  }
}

export const jobService = new JobService();
export default jobService;
