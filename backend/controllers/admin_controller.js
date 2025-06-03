import { PrismaClient } from '@prisma/client';
import { createResponse, handleError } from '../utils/response.utils.js';

const prisma = new PrismaClient();

export const getActivityLogs = async (req, res) => {
  try {
    const activityLogs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(createResponse(true, 'Activity logs fetched successfully', activityLogs));
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    handleError(error, req, res);
  }
};

export const getPasswordChanges = async (req, res) => {
  try {
    const passwordChanges = await prisma.passwordChangeLog.findMany({
      orderBy: { changedAt: 'desc' }
    });
    res.json(createResponse(true, 'Password changes fetched successfully', passwordChanges));
  } catch (error) {
    console.error('Error fetching password changes:', error);
    handleError(error, req, res);
  }
};

export const getEmailChanges = async (req, res) => {
  try {
    const emailChanges = await prisma.emailChangeLog.findMany({
      orderBy: { changedAt: 'desc' }
    });
    res.json(createResponse(true, 'Email changes fetched successfully', emailChanges));
  } catch (error) {
    console.error('Error fetching email changes:', error);
    handleError(error, req, res);
  }
}; 