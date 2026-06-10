import 'package:flutter/material.dart';
import '../widgets/place_card.dart';
import '../theme/app_theme.dart';

class GastronomyView extends StatelessWidget {
  const GastronomyView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      children: [
        Text(
          'Sabores Tradicionales',
          style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 32),
        ),
        const SizedBox(height: 8),
        const Text(
          'Deléitate con la herencia gastronómica del Totonacapan.',
          style: TextStyle(color: AppTheme.textSub),
        ),
        const SizedBox(height: 32),
        
        const PlaceCard(
          title: 'Zacahuil Traditions',
          description: 'El tamal más grande de México, cocido en horno de tierra con leña de encino.',
          imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80',
          category: 'Platillo Típico',
          buttonText: 'Ver más',
        ),
        
        const PlaceCard(
          title: 'Restaurante "El Totonacapan"',
          description: 'Especialistas en bocoles y cocina regional con el aroma de la vainilla auténtica.',
          imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80',
          category: 'Restaurante',
          rating: '4.7 (310 reseñas)',
          buttonText: 'Ver más',
        ),
        
        const PlaceCard(
          title: 'Café de Vainilla',
          description: 'Disfruta de una taza de café fusionada con extracto natural de la vainilla más fina.',
          imageUrl: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80',
          category: 'Cafetería',
          rating: '4.9 (150 reseñas)',
          buttonText: 'Ver más',
        ),
      ],
    );
  }
}
