import express, { Response } from 'express';
import Download from '../models/Download';
import Contact from '../models/Contact';
import Newsletter from '../models/Newsletter';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Proteger todas as rotas de analytics
router.use(requireAuth);
router.use(requireAdmin);

// Estatísticas gerais do dashboard
router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalDownloads,
      totalContacts,
      totalNewsletterSubscribers,
      downloadsThisMonth,
      contactsThisMonth,
      newsletterThisMonth
    ] = await Promise.all([
      Download.countDocuments(),
      Contact.countDocuments(),
      Newsletter.countDocuments(),
      Download.countDocuments({
        timestamp: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      Contact.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      Newsletter.countDocuments({
        subscribedAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        downloads: {
          total: totalDownloads,
          thisMonth: downloadsThisMonth
        },
        contacts: {
          total: totalContacts,
          thisMonth: contactsThisMonth
        },
        newsletter: {
          total: totalNewsletterSubscribers,
          thisMonth: newsletterThisMonth
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
});

// Downloads por período
router.get('/downloads', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const downloads = await Download.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .select('email platform timestamp ipAddress userAgent');

    res.json({
      success: true,
      data: downloads
    });
  } catch (error) {
    console.error('Erro ao buscar downloads:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar downloads'
    });
  }
});

// Downloads por plataforma
router.get('/downloads/by-platform', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const platformStats = await Download.aggregate([
      {
        $group: {
          _id: '$platform',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: platformStats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas por plataforma:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas por plataforma'
    });
  }
});

// Contatos recentes
router.get('/contacts', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('name email subject message createdAt status');

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar contatos'
    });
  }
});

// Newsletter subscribers
router.get('/newsletter', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subscribers = await Newsletter.find()
      .sort({ subscribedAt: -1 })
      .limit(100)
      .select('email isActive subscribedAt');

    res.json({
      success: true,
      data: subscribers
    });
  } catch (error) {
    console.error('Erro ao buscar assinantes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar assinantes'
    });
  }
});

// Downloads ao longo do tempo (últimos 30 dias)
router.get('/downloads/timeline', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timeline = await Download.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: timeline
    });
  } catch (error) {
    console.error('Erro ao buscar timeline de downloads:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar timeline de downloads'
    });
  }
});

export default router;
