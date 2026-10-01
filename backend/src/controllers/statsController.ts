import { Request, Response } from 'express';
import prisma from '../services/prisma.js';

export async function getOverallStats(req: Request, res: Response) {
  try {
    const [
      total,
      inProgress,
      resolved,
      underReview,
      critical,
      citizenConfirmedTotal,
    ] = await Promise.all([
      prisma.issue.count(),
      prisma.issue.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.issue.count({ where: { status: 'RESOLVED' } }),
      prisma.issue.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.issue.count({ where: { severity: 'CRITICAL' } }),
      prisma.issue.aggregate({
        _sum: { communityConfirmations: true },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        total,
        inProgress,
        resolved,
        underReview,
        critical,
        citizenConfirmed: citizenConfirmedTotal._sum.communityConfirmations || 0,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch statistics',
    });
  }
}

export async function getAreaSummaries(req: Request, res: Response) {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        location: true,
      },
    });

    const areasMap: Record<string, any> = {};

    for (const issue of issues) {
      const area = issue.location?.area || 'Dhaka';
      if (!areasMap[area]) {
        areasMap[area] = {
          area,
          total: 0,
          resolved: 0,
          inProgress: 0,
          critical: 0,
          categories: {} as Record<string, number>,
          latSum: 0,
          lngSum: 0,
          countWithCoords: 0,
        };
      }

      areasMap[area].total++;
      if (issue.status === 'RESOLVED') areasMap[area].resolved++;
      if (issue.status === 'IN_PROGRESS') areasMap[area].inProgress++;
      if (issue.severity === 'CRITICAL') areasMap[area].critical++;

      const cat = issue.categoryName || 'Other';
      areasMap[area].categories[cat] = (areasMap[area].categories[cat] || 0) + 1;

      if (issue.location?.latitude && issue.location?.longitude) {
        areasMap[area].latSum += issue.location.latitude;
        areasMap[area].lngSum += issue.location.longitude;
        areasMap[area].countWithCoords++;
      }
    }

    const summaries = Object.values(areasMap).map((a: any) => {
      const topCats = Object.entries(a.categories)
        .map(([name, count]: any) => ({
          name,
          count,
          percent: Math.round((count / a.total) * 100),
        }))
        .sort((x, y) => y.count - x.count)
        .slice(0, 3);

      return {
        area: a.area,
        total: a.total,
        resolved: a.resolved,
        inProgress: a.inProgress,
        critical: a.critical,
        resolutionRate: a.total > 0 ? Math.round((a.resolved / a.total) * 100) : 0,
        center:
          a.countWithCoords > 0
            ? [a.latSum / a.countWithCoords, a.lngSum / a.countWithCoords]
            : [23.8103, 90.4125],
        topCategories: topCats,
      };
    });

    return res.json({
      success: true,
      data: summaries,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch area summaries',
    });
  }
}
