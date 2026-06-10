import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'routes/app_routes.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const PapantlaTurismoApp());
}

class PapantlaTurismoApp extends StatelessWidget {
  const PapantlaTurismoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Papantla | Vuelo y Cultura',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme, 
      routerConfig: AppRoutes.router,
    );
  }
}
