module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@next/next/no-img-element': 'off',
    'react-hooks/exhaustive-deps': 'off'
  },
  // Ignorar completamente esses arquivos
  ignorePatterns: [
    'src/app/colecoes-cores/**/*',
    'src/components/ColorCollection.tsx',
    'src/components/ColorDetailPage.tsx',
    'src/components/ImageCarousel.tsx'
  ]
} 