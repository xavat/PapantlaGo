import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../views/main_layout.dart';
import '../views/home_view.dart';
import '../views/events_view.dart';
import '../views/gastronomy_view.dart';
import '../views/lodging_view.dart';
import '../views/map_view.dart';

class AppRoutes {
  static final GlobalKey<NavigatorState> rootNavigatorKey = GlobalKey<NavigatorState>();
  static final GlobalKey<NavigatorState> shellNavigatorKey = GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: '/home',
    routes: [
      ShellRoute(
        navigatorKey: shellNavigatorKey,
        builder: (context, state, child) {
          int currentIndex = _calculateSelectedIndex(state.uri.toString());
          return MainLayout(
            currentIndex: currentIndex,
            child: child,
          );
        },
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomeView(),
          ),
          GoRoute(
            path: '/events',
            builder: (context, state) => const EventsView(),
          ),
          GoRoute(
            path: '/gastronomy',
            builder: (context, state) => const GastronomyView(),
          ),
          GoRoute(
            path: '/lodging',
            builder: (context, state) => const LodgingView(),
          ),
          GoRoute(
            path: '/map',
            builder: (context, state) => const MapView(),
          ),
        ],
      )
    ],
  );

  static int _calculateSelectedIndex(String location) {
    if (location.startsWith('/home')) return 0;
    if (location.startsWith('/events')) return 1;
    if (location.startsWith('/gastronomy')) return 2;
    if (location.startsWith('/lodging')) return 3;
    if (location.startsWith('/map')) return 4;
    return 0;
  }
}
