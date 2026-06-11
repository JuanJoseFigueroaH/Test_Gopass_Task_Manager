import 'package:flutter/material.dart';

class AppColors {
  static const Color greenPrimary = Color(0xFF2EBD2E);
  static const Color greenDark = Color(0xFF1F911F);
  static const Color greenLight = Color(0xFF4FC74F);
  static const Color blackPrimary = Color(0xFF1A1A1A);
  static const Color blackDark = Color(0xFF0D0D0D);
  static const Color blackLight = Color(0xFF333333);
  static const Color surface = Color(0xFF262626);
  static const Color white = Colors.white;
  static const Color grey = Color(0xFF9E9E9E);
  static const Color error = Color(0xFFE53935);
  static const Color warning = Color(0xFFFFA726);
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.blackPrimary,
      primaryColor: AppColors.greenPrimary,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.greenPrimary,
        secondary: AppColors.greenLight,
        surface: AppColors.surface,
        error: AppColors.error,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.blackDark,
        foregroundColor: AppColors.white,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        color: AppColors.surface,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.greenPrimary,
          foregroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.blackLight,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.greenPrimary),
        ),
        hintStyle: const TextStyle(color: AppColors.grey),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.greenPrimary,
        foregroundColor: AppColors.white,
      ),
    );
  }
}
