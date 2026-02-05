/**
 * Service layer for copy content CRUD operations using Prisma
 */

import { prisma } from '../db';
import { Copy } from '@prisma/client';

export type CopyContent = Copy;

class CopyService {
  async getCopyByKey(key: string): Promise<CopyContent | null> {
    try {
      // Note: The Prisma model is 'Copy', not 'CopyContent'
      // But we need to search by a field that exists in the schema
      // The Copy model doesn't have a 'key' field, so we'll search by companyId
      // This is a placeholder - adjust based on your actual use case
      return await prisma.copy.findFirst({
        where: { 
          // Adjust this query based on your actual schema fields
          companyId: key 
        },
      });
    } catch (error) {
      console.error(`Error fetching copy for key ${key}:`, error);
      return null;
    }
  }

  async getCopyByCompanyId(companyId: string): Promise<CopyContent | null> {
    try {
      return await prisma.copy.findUnique({
        where: { companyId },
      });
    } catch (error) {
      console.error(`Error fetching copy for company ${companyId}:`, error);
      return null;
    }
  }

  async createCopy(companyId: string, data: Partial<Copy>): Promise<CopyContent> {
    try {
      return await prisma.copy.create({
        data: {
          companyId,
          ...data,
        },
      });
    } catch (error) {
      console.error(`Error creating copy:`, error);
      throw error;
    }
  }

  async updateCopy(companyId: string, data: Partial<Copy>): Promise<CopyContent> {
    try {
      return await prisma.copy.update({
        where: { companyId },
        data,
      });
    } catch (error) {
      console.error(`Error updating copy:`, error);
      throw error;
    }
  }

  async deleteCopy(companyId: string): Promise<void> {
    try {
      await prisma.copy.delete({
        where: { companyId },
      });
    } catch (error) {
      console.error(`Error deleting copy:`, error);
      throw error;
    }
  }

  async upsertCopy(companyId: string, data: Partial<Copy>): Promise<CopyContent> {
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
      console.error(`Error upserting copy:`, error);
      throw error;
    }
  }
}

export const copyService = new CopyService();
export default copyService;
