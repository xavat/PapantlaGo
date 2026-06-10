import 'package:flutter/material.dart';
import '../widgets/place_card.dart';
import '../widgets/category_chip.dart';
import '../theme/app_theme.dart';

class LodgingView extends StatefulWidget {
  const LodgingView({super.key});

  @override
  State<LodgingView> createState() => _LodgingViewState();
}

class _LodgingViewState extends State<LodgingView> {
  String _selectedCategory = 'Hoteles';

  final List<String> _categories = ['Hoteles', 'Posadas', 'Boutique', 'Cabañas'];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Horizontal Filters
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Row(
            children: _categories.map((cat) {
              return CategoryChip(
                label: cat,
                isSelected: _selectedCategory == cat,
                onTap: () => setState(() => _selectedCategory = cat),
              );
            }).toList(),
          ),
        ),

        // Lodging List
        Expanded(
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            children: [
              Text(
                'Encuentra tu estancia ideal',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 28),
              ),
              const SizedBox(height: 24),
              const PlaceCard(
                title: 'Hotel Tajín',
                category: 'Hotel',
                rating: '4.5 (250 reseñas)',
                price: '$1,500 - $3,000 MXN',
                imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
                buttonText: 'Ver detalles',
              ),
              const PlaceCard(
                title: 'Posada KXLIL',
                category: 'Posada',
                rating: '4.8 (180 reseñas)',
                price: '$800 - $1,500 MXN',
                imageUrl: 'https://images.unsplash.com/photo-1551882547-ff43c63efe81?auto=format&fit=crop&q=80',
                buttonText: 'Ver detalles',
              ),
              const PlaceCard(
                title: 'Hotel Boutique Casa de los Vientos',
                category: 'Boutique',
                rating: '4.9 (120 reseñas)',
                price: '$2,500 - $4,500 MXN',
                imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80',
                buttonText: 'Ver detalles',
              ),
              const SizedBox(height: 80), // Space for FAB
            ],
          ),
        ),
      ],
    );
  }
}
