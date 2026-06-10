import 'package:flutter/material.dart';
import '../widgets/image_carousel.dart';
import '../theme/app_theme.dart';

class CultureView extends StatelessWidget {
  const CultureView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      children: [
        Text(
          'Raíces',
          style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 40),
        ),
        Text(
          'Prehispánicas',
          style: Theme.of(context).textTheme.displayLarge?.copyWith(
                color: AppTheme.accentTerracotta,
                fontSize: 48,
              ),
        ),
        const SizedBox(height: 24),
        const ImageCarousel(
          height: 250,
          imageUrls: [
            'https://images.unsplash.com/photo-1627997092120-d66a6ef413d7?auto=format&fit=crop&q=80', // Tajín
            'https://images.unsplash.com/photo-1548174786-8a30d9515bd1?auto=format&fit=crop&q=80', 
            'https://images.unsplash.com/photo-1626081498877-c93d8e57eeff?auto=format&fit=crop&q=80',
          ],
        ),
        const SizedBox(height: 32),
        _buildSection(
          context,
          'Zona Arqueológica "El Tajín"',
          'La Ciudad del Trueno',
          'Conocida por la Pirámide de los Nichos, la cual cuenta con 365 nichos simbolizando el calendario solar. Es Patrimonio de la Humanidad desde 1992.',
        ),
        _buildSection(
          context,
          'Museo Teodoro Cano',
          'Arte y Escultura',
          'Recorrido por la obra del prolífico maestro Teodoro Cano, con murales, esculturas y pinturas que narran la historia del pueblo totonaco y de México.',
        ),
        _buildSection(
          context,
          'Festival Cumbre Tajín',
          'Identidad Viva',
          'Celebración anual en la llegada de la primavera. Promociona conciertos multigenéricos, danza, gastronomía y ceremonias místicas en el Parque Temático Takilhsukut.',
        ),
      ],
    );
  }

  Widget _buildSection(BuildContext context, String title, String subtitle, String content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.surfaceDark.withOpacity(0.9),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.glassWhite),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: AppTheme.primaryVanilla,
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: Colors.white54,
                  letterSpacing: 2,
                ),
          ),
          const SizedBox(height: 16),
          Text(
            content,
            style: Theme.of(context).textTheme.bodyLarge,
          ),
        ],
      ),
    );
  }
}
