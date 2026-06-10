import 'package:flutter/material.dart';
import '../widgets/place_card.dart';
import '../theme/app_theme.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      children: [
        // Explorar Section Title
        Text(
          'Descubre lo Mejor',
          style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 32),
        ),
        const SizedBox(height: 8),
        const Text(
          'Encuentra los rincones más mágicos de la ciudad totonaca.',
          style: TextStyle(color: AppTheme.textSub),
        ),
        const SizedBox(height: 32),
        
        // Place Cards for exploration
        const PlaceCard(
          title: 'Zona Arqueológica El Tajín',
          description: 'La ciudad prehispánica más importante de la costa norte de Veracruz y Patrimonio Mundial de la UNESCO.',
          imageUrl: 'https://images.unsplash.com/photo-1627997092120-d66a6ef413d7?auto=format&fit=crop&q=80',
          icon1: Icons.access_time_outlined,
          label1: '9:00 - 17:00',
          icon2: Icons.payments_outlined,
          label2: '\$\$',
          buttonText: 'Ver más',
        ),
        
        const PlaceCard(
          title: 'Centro Histórico de Papantla',
          description: 'Corazón de la ciudad, con su iglesia de Nuestra Señora de la Asunción, quiosco y ritual de voladores.',
          imageUrl: 'https://images.unsplash.com/photo-1548174786-8a30d9515bd1?auto=format&fit=crop&q=80',
          icon1: Icons.access_time_outlined,
          label1: 'Abierto 24h',
          icon2: Icons.payments_outlined,
          label2: 'Gratis',
          buttonText: 'Ver más',
        ),
        
        const PlaceCard(
          title: 'Mural Homenaje a la Cultura Totonaca',
          description: 'Gran obra escultórica del maestro Teodoro Cano que narra la historia mitológica del pueblo totonaco.',
          imageUrl: 'https://images.unsplash.com/photo-1626081498877-c93d8e57eeff?auto=format&fit=crop&q=80',
          icon1: Icons.remove_red_eye_outlined,
          label1: 'Visible 24h',
          icon2: Icons.payments_outlined,
          label2: 'Gratis',
          buttonText: 'Ver más',
        ),
        const SizedBox(height: 40),
      ],
    );
  }
}
