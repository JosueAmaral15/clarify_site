import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Download from '../models/Download';

const router = express.Router();

// POST /api/downloads - Registrar download
router.post(
  '/',
  [
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail()
      .trim(),
    body('platform')
      .optional()
      .isIn(['windows', 'macos', 'linux', 'other'])
      .withMessage('Plataforma inválida')
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
        return;
      }

      const { email, platform } = req.body;
      
      // Capturar informações do request
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('user-agent');

      // Criar registro de download
      const download = new Download({
        email,
        platform: platform || 'other',
        ipAddress,
        userAgent
      });

      await download.save();

      res.status(201).json({
        success: true,
        message: 'Download registrado com sucesso',
        data: {
          id: download._id,
          timestamp: download.timestamp
        }
      });

    } catch (error) {
      console.error('Erro ao registrar download:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao registrar download'
      });
    }
  }
);

// GET /api/downloads/stats - Estatísticas de downloads (protegido - adicionar auth depois)
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const total = await Download.countDocuments();
    const byPlatform = await Download.aggregate([
      {
        $group: {
          _id: '$platform',
          count: { $sum: 1 }
        }
      }
    ]);

    const last7Days = await Download.countDocuments({
      timestamp: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      success: true,
      data: {
        total,
        last7Days,
        byPlatform
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
});

export default router;
