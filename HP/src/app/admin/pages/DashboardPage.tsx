import { useData } from '../../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LayoutDashboard, UtensilsCrossed, Image, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const { menuItems, galleryImages, analytics } = useData();

  const stats = [
    {
      title: '総訪問者数',
      value: analytics.totalVisits.toLocaleString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '今日の訪問者',
      value: analytics.todayVisits.toLocaleString(),
      icon: LayoutDashboard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'メニュー数',
      value: menuItems.length.toLocaleString(),
      icon: UtensilsCrossed,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'ギャラリー画像',
      value: galleryImages.length.toLocaleString(),
      icon: Image,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* お知らせバナー */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 text-white shadow-md mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">新機能が登場しました！</h3>
              <p className="text-purple-100 text-sm">テンプレートが新しくなりました。より魅力的なサイトを作成できます。</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white text-purple-600 rounded-full text-sm font-bold hover:bg-purple-50 transition-colors">
            詳細を見る
          </button>
        </div>
      </div>

      {/* マイサイト一覧 (ダミーデータ) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">マイサイト</h2>
          <button className="text-sm text-purple-600 font-medium hover:text-purple-700">すべて見る</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {/* 現在のサイト */}
          <div className="min-w-[280px] bg-white rounded-xl border border-purple-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-100 relative">
              <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60" alt="KABUKI Sushi" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">公開中</div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900">KABUKI寿司 1番通り店</h3>
              <p className="text-xs text-gray-500 mt-1">最終更新: 6時間前</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.location.href = '/editor_mock.html'}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  編集
                </button>
                <button className="px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">統計</button>
              </div>
            </div>
          </div>

          {/* 他のサイト (ダミー) */}
          <div className="min-w-[280px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-100 relative">
              <img src="https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&auto=format&fit=crop&q=60" alt="New Store" className="w-full h-full object-cover opacity-80" />
              <div className="absolute top-2 right-2 px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">準備中</div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900">KABUKI寿司 新店舗</h3>
              <p className="text-xs text-gray-500 mt-1">最終更新: 2日前</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-white border border-purple-600 text-purple-600 text-sm rounded-lg hover:bg-purple-50 transition-colors">編集</button>
                <button className="px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">設定</button>
              </div>
            </div>
          </div>

          <div className="min-w-[280px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
              <span className="text-2xl">+</span>
            </div>
            <span className="font-medium">新しいサイトを作成</span>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">ダッシュボード概要</h1>
        <p className="text-gray-600">サイトのパフォーマンスと状態を確認できます</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 最近の更新 */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>最近の更新</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentUpdates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">最近の更新はありません</p>
          ) : (
            <div className="space-y-4">
              {analytics.recentUpdates.map((update, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${update.type === 'menu' ? 'bg-purple-600' :
                    update.type === 'gallery' ? 'bg-orange-600' :
                      'bg-blue-600'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{update.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(update.timestamp).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* やることリスト (進捗バー付き) */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>セットアップチェックリスト</span>
            <span className="text-sm font-normal text-gray-500">完了率: 60%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[60%] rounded-full" />
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'アカウントを作成する', done: true },
              { label: 'サイトのデザインを選択する', done: true },
              { label: 'メニューを登録する', done: true },
              { label: '独自ドメインを接続する', done: false },
              { label: 'サイトを公開する', done: false },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-3 rounded-lg border ${item.done ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-purple-300 transition-colors cursor-pointer'}`}>
                <div className={`w-6 h-6 rounded flex items-center justify-center ${item.done ? 'bg-green-500 text-white' : 'border-2 border-gray-300'}`}>
                  {item.done && <span className="text-sm">✓</span>}
                </div>
                <span className={`text-sm font-medium ${item.done ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {item.label}
                </span>
                {!item.done && (
                  <span className="ml-auto text-xs text-purple-600 font-bold">今すぐやる →</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
