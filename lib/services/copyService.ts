/**
 * Service layer for copy content using Prisma
 */

import { prisma } from '../db';
import { Copy } from '@prisma/client';

export type CopyContent = Copy;

class CopyService {
  /**
   * Get copy for a specific company
   */
  async getCopy(companyId?: string): Promise<Copy | null> {
    try {
      if (!companyId) {
        // Get the first copy or from a default company
        return await prisma.copy.findFirst();
      }
      return await prisma.copy.findUnique({
        where: { companyId },
      });
    } catch (error) {
      console.error('Error fetching copy:', error);
      return null;
    }
  }

  /**
   * Get copy by key (legacy method for backward compatibility)
   */
  async getCopyByKey(key: string): Promise<Copy | null> {
    try {
      // Assuming 'key' is the companyId for now
      return await prisma.copy.findUnique({
        where: { companyId: key },
      });
    } catch (error) {
      console.error(`Error fetching copy for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Get copy by section (returns the copy object, app can filter by section field)
   */
  async getCopyBySection(section: string): Promise<Copy | null> {
    try {
      // Since Copy model doesn't have a section field directly,
      // this returns the first copy. Apps should handle section filtering.
      return await prisma.copy.findFirst();
    } catch (error) {
      console.error(`Error fetching copy for section ${section}:`, error);
      return null;
    }
  }

  /**
   * Create new copy
   */
  async createCopy(companyId: string, data: Partial<Copy>): Promise<Copy> {
    try {
      return await prisma.copy.create({
        data: {
          companyId,
          ...data,
        },
      });
    } catch (error) {
      console.error('Error creating copy:', error);
      throw error;
    }
  }

  /**
   * Update copy
   */
  async updateCopy(companyId: string, data: Partial<Copy>): Promise<Copy> {
    try {
      return await prisma.copy.update({
        where: { companyId },
        data,
      });
    } catch (error) {
      console.error('Error updating copy:', error);
      throw error;
    }
  }

  /**
   * Delete copy
   */
  async deleteCopy(companyId: string): Promise<void> {
    try {
      await prisma.copy.delete({
        where: { companyId },
      });
    } catch (error) {
      console.error('Error deleting copy:', error);
      throw error;
    }
  }

  /**
   * Upsert copy
   */
  async upsertCopy(companyId: string, data: Partial<Copy>): Promise<Copy> {
    try {
      return await prisma.copy.upsert({
        where: { companyId },
        create: {
          companyId,
          ...data,
        },
        update: data,
      });
    } catch (error) {
      console.error('Error upserting copy:', error);
      throw error;
    }
  }
}

export const copyService = new CopyService();
export default copyService;
