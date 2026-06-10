import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';

class MainLayout extends StatelessWidget {
  final int currentIndex;
  final Widget child;

  const MainLayout({
    super.key,
    required this.currentIndex,
    required this.child,
  });

  void _onItemTapped(BuildContext context, int index) {
    if (index == currentIndex) return;
    switch (index) {
      case 0:
        context.go('/home');
        break;
      case 1:
        context.go('/events');
        break;
      case 2:
        context.go('/gastronomy');
        break;
      case 3:
        context.go('/lodging');
        break;
      case 4:
        context.go('/map');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 800;
    
    String title = 'Explora Papantla';
    if (currentIndex == 1) title = 'Calendario de Eventos';
    if (currentIndex == 2) title = 'Gastronomía Local';
    if (currentIndex == 3) title = 'Hospedaje en Papantla';
    if (currentIndex == 4) title = 'Mapa Interactivo';

    final appBar = AppBar(
      title: Text(title),
      leading: currentIndex != 0 ? IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home')) : null,
      actions: [
        if (currentIndex == 0) IconButton(icon: const Icon(Icons.search), onPressed: () {}),
        if (currentIndex == 0) IconButton(icon: const Icon(Icons.map_outlined), onPressed: () => context.go('/map')),
        if (currentIndex == 1) IconButton(icon: const Icon(Icons.bookmark_border), onPressed: () {}),
        if (currentIndex == 3) IconButton(icon: const Icon(Icons.search), onPressed: () {}),
        const SizedBox(width: 8),
      ],
    );

    return Scaffold(
      appBar: appBar,
      body: Row(
        children: [
          if (!isDesktop && MediaQuery.of(context).size.width >= 600)
            NavigationRail(
              selectedIndex: currentIndex,
              onDestinationSelected: (index) => _onItemTapped(context, index),
              labelType: NavigationRailLabelType.all,
              destinations: const [
                NavigationRailDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: Text('Inicio')),
                NavigationRailDestination(icon: Icon(Icons.calendar_month_outlined), selectedIcon: Icon(Icons.calendar_month), label: Text('Eventos')),
                NavigationRailDestination(icon: Icon(Icons.restaurant_outlined), selectedIcon: Icon(Icons.restaurant), label: Text('Sabor')),
                NavigationRailDestination(icon: Icon(Icons.hotel_outlined), selectedIcon: Icon(Icons.hotel), label: Text('Hoteles')),
                NavigationRailDestination(icon: Icon(Icons.map_outlined), selectedIcon: Icon(Icons.map), label: Text('Mapa')),
              ],
            ),
          
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: child,
            ),
          ),
        ],
      ),
      bottomNavigationBar: MediaQuery.of(context).size.width < 600
          ? Container(
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: Colors.black.withOpacity(0.05))),
              ),
              child: BottomNavigationBar(
                currentIndex: currentIndex,
                onTap: (index) => _onItemTapped(context, index),
                items: const [
                  BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Inicio'),
                  BottomNavigationBarItem(icon: Icon(Icons.calendar_month_outlined), activeIcon: Icon(Icons.calendar_month), label: 'Eventos'),
                  BottomNavigationBarItem(icon: Icon(Icons.restaurant_outlined), activeIcon: Icon(Icons.restaurant), label: 'Sabor'),
                  BottomNavigationBarItem(icon: Icon(Icons.hotel_outlined), activeIcon: Icon(Icons.hotel), label: 'Hoteles'),
                  BottomNavigationBarItem(icon: Icon(Icons.map_outlined), activeIcon: Icon(Icons.map), label: 'Mapa'),
                ],
              ),
            )
          : null,
      floatingActionButton: currentIndex == 3
          ? FloatingActionButton(
              onPressed: () => context.go('/map'),
              backgroundColor: AppTheme.primaryOrange,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: const Icon(Icons.map, color: Colors.white),
            )
          : null,
    );
  }
}
