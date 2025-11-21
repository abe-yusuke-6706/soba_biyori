蕎麦が好きという個人的な思いから、React の学習を兼ねて蕎麦レビューアプリを開発しました。
バックエンドには、前回使用した Rails と共通点の多い Laravel を選び、フロントエンドとは Inertia.js を用いて連携しています。
また、ユーザー体験の向上と自分自身の興味もあり、外部 API として Google Maps JavaScript API を導入し、位置情報を使った店舗表示機能も実装しました。

構成：
・バックエンド：Laravel 11
・フロントエンド基盤：React 18（JavaScript, Inertia.js、）
・UIフレームワーク：Chakra UI v2 / Saas UI v2
・スタイリング補助：Tailwind CSS
・通信：Inertia.js / Axios など
・マップ機能: Google Maps Platform
