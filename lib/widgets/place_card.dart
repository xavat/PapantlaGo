import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class PlaceCard extends StatelessWidget {
  final String title;
  final String description;
  final String imageUrl;
  final String? category;
  final String? rating;
  final String? price;
  final String buttonText;
  final IconData? icon1;
  final IconData? icon2;
  final String? label1;
  final String? label2;
  final VoidCallback? onTap;

  const PlaceCard({
    super.key,
    required this.title,
    required this.description,
    required this.imageUrl,
    this.category,
    this.rating,
    this.price,
    this.buttonText = 'Ver más',
    this.icon1,
    this.icon2,
    this.label1,
    this.label2,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 24),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image
          AspectRatio(
            aspectRatio: 16 / 9,
            child: Image.network(
              imageUrl,
              fit: BoxFit.cover,
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (rating != null) ...[
                  Row(
                    children: [
                      const Icon(Icons.star, color: AppTheme.primaryOrange, size: 18),
                      const SizedBox(width: 4),
                      Text(
                        rating!,
                        style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textSub),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                ],
                
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                
                if (category != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    category!,
                    style: const TextStyle(color: AppTheme.textSub, fontSize: 14),
                  ),
                ],
                
                if (icon1 != null || label1 != null) ...[
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      if (icon1 != null) Icon(icon1, size: 16, color: AppTheme.primaryOrange),
                      if (label1 != null) Padding(
                        padding: const EdgeInsets.only(left: 4),
                        child: Text(label1!, style: const TextStyle(fontSize: 12, color: AppTheme.textSub)),
                      ),
                      const SizedBox(width: 16),
                      if (icon2 != null) Icon(icon2, size: 16, color: AppTheme.primaryOrange),
                      if (label2 != null) Padding(
                        padding: const EdgeInsets.only(left: 4),
                        child: Text(label2!, style: const TextStyle(fontSize: 12, color: AppTheme.textSub)),
                      ),
                    ],
                  ),
                ],
                
                const SizedBox(height: 12),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontSize: 14),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (price != null)
                      Text(
                        price!,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.textSub),
                      )
                    else
                      const Spacer(),
                    
                    ElevatedButton(
                      onPressed: onTap,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: buttonText == 'Ver más' ? AppTheme.accentYellow : AppTheme.primaryOrange,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(buttonText, style: const TextStyle(fontWeight: FontWeight.bold)),
                          if (buttonText == 'Ver más')
                            const Padding(
                              padding: EdgeInsets.only(left: 8),
                              child: Icon(Icons.arrow_forward, size: 16),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
