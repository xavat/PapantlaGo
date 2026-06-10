import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class MapView extends StatefulWidget {
  const MapView({super.key});

  @override
  State<MapView> createState() => _MapViewState();
}

class _MapViewState extends State<MapView> {
  final List<Map<String, dynamic>> _pointsOfInterest = [
    {
      'title': 'Tajín',
      'icon': Icons.museum,
      'offset': const Offset(0.3, 0.4),
      'description': 'Zona Arqueológica Pirámide de los Nichos'
    },
    {
      'title': 'Zócalo',
      'icon': Icons.church,
      'offset': const Offset(0.6, 0.5),
      'description': 'Parque Israel C. Couturier y Catedral'
    },
    {
      'title': 'Museo Cano',
      'icon': Icons.palette,
      'offset': const Offset(0.5, 0.6),
      'description': 'Arte y esculturas Totonacas'
    },
    {
      'title': 'Cumbre',
      'icon': Icons.festival,
      'offset': const Offset(0.2, 0.2),
      'description': 'Parque Takilhsukut'
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(24.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Rutas & \nDestinos',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                      fontSize: 36,
                      height: 1.1,
                    ),
              ),
              const Icon(Icons.map, size: 48, color: AppTheme.accentTerracotta),
            ],
          ),
        ),
        Expanded(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.surfaceDark,
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: AppTheme.glassWhite, width: 2),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(30),
              child: InteractiveViewer(
                boundaryMargin: const EdgeInsets.all(40),
                minScale: 0.8,
                maxScale: 3.0,
                child: Stack(
                  children: [
                    // Placeholder background for the map
                    Container(
                      width: double.infinity,
                      height: double.infinity,
                      decoration: BoxDecoration(
                        gradient: RadialGradient(
                          colors: [
                            AppTheme.bgDark.withOpacity(0.8),
                            AppTheme.surfaceDark,
                          ],
                          radius: 1.5,
                        ),
                        image: const DecorationImage(
                          image: NetworkImage('https://images.unsplash.com/photo-1524661135-423533464528?auto=format&fit=crop&q=80'), // Map visualization aesthetic
                          fit: BoxFit.cover,
                          opacity: 0.3,
                        ),
                      ),
                    ),
                    ..._pointsOfInterest.map((poi) {
                      return Positioned(
                        top: MediaQuery.of(context).size.height * poi['offset'].dy,
                        left: MediaQuery.of(context).size.width * poi['offset'].dx,
                        child: GestureDetector(
                          onTap: () {
                            _showMapDetails(context, poi['title'], poi['description'], poi['icon']);
                          },
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppTheme.accentTerracotta,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppTheme.accentTerracotta.withOpacity(0.6),
                                      blurRadius: 15,
                                      spreadRadius: 4,
                                    )
                                  ],
                                ),
                                child: Icon(poi['icon'], color: Colors.white, size: 28),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                poi['title'],
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ],
                ),
              ),
            ),
          ),
        ),
        const Padding(
          padding: EdgeInsets.all(24.0),
          child: Text(
            'Desliza y pellizca para explorar el mapa interactivo de la región totonaca.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white54, fontStyle: FontStyle.italic),
          ),
        ),
      ],
    );
  }

  void _showMapDetails(BuildContext context, String title, String description, IconData icon) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(32),
          decoration: const BoxDecoration(
            color: AppTheme.bgDark,
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: AppTheme.primaryVanilla, size: 32),
                  const SizedBox(width: 16),
                  Text(
                    title,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                description,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accentTerracotta,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cerrar', style: TextStyle(color: Colors.white)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
