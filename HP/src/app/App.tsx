import { useState } from 'react';
import { Menu, X, MapPin, Phone, Clock } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#1C1C1C]/95 backdrop-blur-sm z-50 border-b border-[#deb55a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button 
              onClick={() => scrollToSection('home')}
              style={{ fontFamily: "'Bad Script', cursive" }}
              className="text-2xl text-[#fcebc5] hover:text-[#deb55a] transition-colors"
            >
              KABUKI寿司 1番通り店
            </button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('about')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-[#e8eaec] hover:text-[#deb55a] transition-colors">ABOUT</button>
              <button onClick={() => scrollToSection('gallery')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-[#e8eaec] hover:text-[#deb55a] transition-colors">GALLERY</button>
              <button onClick={() => scrollToSection('menu')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-[#e8eaec] hover:text-[#deb55a] transition-colors">MENU</button>
              <button onClick={() => scrollToSection('access')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-[#e8eaec] hover:text-[#deb55a] transition-colors">ACCESS</button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-[#e8eaec]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1C1C1C] border-t border-[#deb55a]/20">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('about')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="block w-full text-left text-[#e8eaec] hover:text-[#deb55a] transition-colors py-2">ABOUT</button>
              <button onClick={() => scrollToSection('gallery')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="block w-full text-left text-[#e8eaec] hover:text-[#deb55a] transition-colors py-2">GALLERY</button>
              <button onClick={() => scrollToSection('menu')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="block w-full text-left text-[#e8eaec] hover:text-[#deb55a] transition-colors py-2">MENU</button>
              <button onClick={() => scrollToSection('access')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="block w-full text-left text-[#e8eaec] hover:text-[#deb55a] transition-colors py-2">ACCESS</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlJTIwZm9vZHxlbnwxfHx8fDE3NjU5NjY2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080')` }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="mb-8">
            <div className="w-48 h-32 mx-auto mb-4 bg-[#deb55a]/10 rounded flex items-center justify-center">
              <span style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-[#fcebc5]">KABUKI</span>
            </div>
          </div>
          <div className="space-y-6">
            <a 
              href="https://grizzle-giraffe-1fgdjb.mystrikingly.com/traveler" 
              style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
              className="inline-block px-6 py-2 text-sm text-[#e8eaec] hover:text-[#deb55a] transition-colors border border-[#e8eaec]/30 rounded hover:border-[#deb55a]"
            >
              Languages: English · 中文 · 한국어
            </a>
            <div>
              <button 
                onClick={() => scrollToSection('menu')}
                style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
                className="px-12 py-4 bg-[#deb55a] text-[#1C1C1C] rounded-lg hover:bg-[#fcebc5] transition-colors font-bold text-lg"
              >
                メニュー
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.tablecheck.com/shops/kabukisushi-ichiban/reserve" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
                className="px-8 py-3 text-[#886107] hover:text-[#1C1C1C] bg-white/90 hover:bg-white rounded transition-colors font-semibold"
              >
                予約はこちら
              </a>
              <a 
                href="https://maps.app.goo.gl/yC8c23nWvXpjYmoXA" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
                className="px-8 py-3 text-[#e8eaec] hover:text-[#deb55a] border-2 border-[#e8eaec] hover:border-[#deb55a] rounded transition-colors font-semibold"
              >
                Google Maps
              </a>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://www.instagram.com/kabukizushi_ichiban?igsh=MWRzdmxuNzF1ODlzNA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="px-6 py-2 text-[#e8eaec] hover:text-[#deb55a] border border-[#e8eaec]/30 rounded hover:border-[#deb55a] transition-colors">Instagram</a>
              <a href="https://www.tiktok.com/@kabukisushi1001?_t=8kzjmGapCuP&_r=1" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="px-6 py-2 text-[#e8eaec] hover:text-[#deb55a] border border-[#e8eaec]/30 rounded hover:border-[#deb55a] transition-colors">Tik Tok</a>
              <a href="https://www.youtube.com/@KABUKI-ev3sy" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="px-6 py-2 text-[#e8eaec] hover:text-[#deb55a] border border-[#e8eaec]/30 rounded hover:border-[#deb55a] transition-colors">YouTube</a>
              <a href="https://www.facebook.com/profile.php?id=100064940143541" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="px-6 py-2 text-[#e8eaec] hover:text-[#deb55a] border border-[#e8eaec]/30 rounded hover:border-[#deb55a] transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-center mb-4">ABOUT US</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
            <div>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1651977560790-42e0c5cf2ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjYwNjUxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="KABUKI寿司 1番通り店"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <div className="space-y-4" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>
              <p className="text-lg">KABUKI寿司の2号店となる <strong>「KABUKI寿司 1番通り店」</strong> をオープンいたしました。</p>
              <p>1番通り店では、これまでの伝統を受け継ぎながらも、さらなる進化を目指しています。</p>
              <p>店主を務めるのは、<strong>新進気鋭の若手寿司職人増田</strong>。</p>
              <p>繊細な技術と斬新なアイデアで、新しい「KABUKI寿司」の世界を皆さまにお届けいたします。</p>
              <p>お店の特徴の一つは、<strong>カウンター付きの個室</strong>です。職人の技を間近で堪能しながら、ゆったりとしたプライベート空間でお食事をお楽しみいただけます。特別な日のお祝いから接待まで、幅広いシーンでご利用いただけます。</p>
              <p>伝統と革新が融合したKABUKI寿司 1番通り店で、特別なひとときをお過ごしください。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-[#E8EAEC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-center mb-4 text-[#1C1C1C]">Gallery</h2>
          <p className="text-center text-gray-600 mb-12">Photos from our restaurant.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <ImageWithFallback 
                  src={`https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400&auto=format&q=80`}
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section id="access" className="py-20 bg-cover bg-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512132411229-c30391241dd8?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1080')` }}>
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-center mb-12 text-[#1C1C1C]">ACCESS</h2>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>
              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-[#deb55a] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-lg">〒160-0021</p>
                  <p className="text-gray-700">東京都新宿区歌舞伎町2丁目45−16</p>
                  <p className="text-gray-700">GEST34ビル4F</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6 text-[#deb55a]" />
                <p className="text-lg">03-6302-1477</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-[#deb55a]" />
                <p className="text-lg">OPEN : 18:00-24:00</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1638866381709-071747b518c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&h=450&auto=format&q=80"
                alt="Map"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-center mb-4 text-[#1C1C1C]">Menu</h2>
          <p className="text-center text-xl mb-12" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>Course</p>
          <p className="text-center text-gray-600 mb-12">まずは当店お勧めのコースからお選びください</p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#1C1C1C]">おまかせにぎり８貫</h3>
              <p className="text-3xl text-[#deb55a] font-bold mb-4">¥4,980</p>
              <p className="text-gray-600">お勧め握り８貫と本日の１品、お椀</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#1C1C1C]">特選にぎり８貫</h3>
              <p className="text-3xl text-[#deb55a] font-bold mb-4">¥6,980</p>
              <p className="text-gray-600">贅沢なお勧め握り８貫と本日の１品、お椀</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#1C1C1C]">特選にぎり１０貫</h3>
              <p className="text-3xl text-[#deb55a] font-bold mb-4">¥9,900</p>
              <p className="text-gray-600">贅沢なお勧め握り１０貫と本日の１品<br/>厳選刺身５種盛り合わせ、お椀</p>
            </div>
          </div>

          {/* NIGIRI Section */}
          <div className="mb-16">
            <h3 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-8 text-[#1C1C1C]">NIGIRI</h3>
            <p className="text-center text-xl mb-8 text-[#deb55a]" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>Fish in Season</p>
            <p className="text-center text-gray-600 mb-8">季節の魚</p>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: '赤身', price: '550' },
                { name: '中トロ', price: '780' },
                { name: '大トロ', price: '880' },
                { name: '大トロ炙り', price: '880' },
                { name: '海ぶどうトロ手巻き', price: '880' },
                { name: 'タイ', price: '480' },
                { name: '金目鯛', price: '550' },
                { name: 'カマス', price: '550' },
                { name: 'サワラ', price: '550' },
                { name: 'ブリ', price: '550' },
                { name: 'アジ', price: '450' },
                { name: 'カツオ', price: '500', soldOut: true },
                { name: 'サーモン', price: '450' },
                { name: '炙りサーモン', price: '450' },
                { name: '車海老', price: '980' },
                { name: '車海老カダイフ揚げ', price: '1300' },
                { name: '生海老漬け', price: '480' },
                { name: 'イカ', price: '550' },
                { name: '水タコ', price: '550' },
                { name: 'ホタテ', price: '600' },
                { name: '赤貝', price: '850' },
                { name: 'えんがわ', price: '550' },
                { name: 'ウナギドック', price: '680' },
                { name: '穴子', price: '680' },
                { name: 'ノドグロドック', price: '900' },
                { name: 'タチウオドック', price: '700', soldOut: true },
                { name: 'とびっこ', price: '400' },
                { name: '白子軍艦', price: '550' },
                { name: 'いくら', price: '600' },
                { name: 'ウニ', price: '880' },
                { name: '玉子', price: '350' },
                { name: '芽ネギ', price: '350' },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1763647756796-af9230245bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&h=300&auto=format&q=80"
                    alt={item.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="font-bold text-lg text-[#1C1C1C]">
                    {item.name}
                    {item.soldOut && <span className="text-red-600 text-sm ml-2">売り切れ</span>}
                  </h4>
                  <p className="text-[#deb55a] font-bold">¥{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MAKIMONO Section */}
          <div className="mb-16">
            <h3 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-8 text-[#1C1C1C]">MAKIMONO</h3>
            <p className="text-center text-gray-600 mb-8">巻物</p>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: 'トロたく巻き', price: '1200' },
                { name: 'ネギトロ巻き', price: '1000' },
                { name: '鉄火巻き', price: '1200' },
                { name: 'ウニトロ巻き', price: '2000' },
                { name: 'カッパ巻き', price: '650' },
                { name: 'かんぴょう巻き', price: '650' },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1712725214706-e564b8dd1bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&h=300&auto=format&q=80"
                    alt={item.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="font-bold text-lg text-[#1C1C1C]">{item.name}</h4>
                  <p className="text-[#deb55a] font-bold">¥{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* IPPIN Section */}
          <div className="mb-16">
            <h3 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-8 text-[#1C1C1C]">IPPIN</h3>
            <p className="text-center text-gray-600 mb-8">一品料理</p>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: '味噌汁', price: '350' },
                { name: '茶碗蒸し', price: '650' },
                { name: '刺身盛り合わせ', price: '2000', note: '※その他(赤身だけ3人前、おまかせ3種類2人前)など、お客様のご要望あれば、お気軽にお申し付けください。' },
                { name: 'カニつまみ', price: '980' },
                { name: '白子（ポン酢・天ぷら）', price: '1300' },
                { name: '生牡蠣', price: '750' },
                { name: '海鮮ユッケ', price: '980' },
                { name: 'マグロカマ焼き', price: '3200' },
                { name: 'サーモンハラス焼き', price: '1800' },
                { name: 'タチウオ塩焼き', price: '980' },
                { name: 'つまみ玉子', price: '680' },
                { name: '大福アイス', price: '580' },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                  <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="font-bold text-lg text-[#1C1C1C] mb-2">{item.name}</h4>
                  <p className="text-[#deb55a] font-bold mb-2">¥{item.price}</p>
                  {item.note && <p className="text-sm text-gray-600">{item.note}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* DRINK Section */}
          <div>
            <h3 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-8 text-[#1C1C1C]">Drink</h3>
            <p className="text-center text-gray-600 mb-8">お飲み物</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-4 text-[#1C1C1C]">日本酒（１合）</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between"><span>黒龍　福井</span><span className="text-[#deb55a] font-bold">¥1,800</span></li>
                  <li className="flex justify-between"><span>三井の寿　福岡</span><span className="text-[#deb55a] font-bold">¥1,500</span></li>
                  <li className="flex justify-between"><span>日高見　宮城</span><span className="text-[#deb55a] font-bold">¥1,500</span></li>
                  <li className="flex justify-between"><span>ゼブラ　山形</span><span className="text-[#deb55a] font-bold">¥3,500</span></li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-4 text-[#1C1C1C]">ビール・焼酎・その他</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between"><span>サントリー プレミアムモルツ生</span><span className="text-[#deb55a] font-bold">¥880</span></li>
                  <li className="flex justify-between"><span>サッポロラガー中瓶</span><span className="text-[#deb55a] font-bold">¥900</span></li>
                  <li className="flex justify-between"><span>角ハイボール</span><span className="text-[#deb55a] font-bold">¥770</span></li>
                  <li className="flex justify-between"><span>富乃宝山(芋)</span><span className="text-[#deb55a] font-bold">¥880</span></li>
                  <li className="flex justify-between"><span>吉四六(麦)</span><span className="text-[#deb55a] font-bold">¥880</span></li>
                  <li className="flex justify-between"><span>鳥飼(米)</span><span className="text-[#deb55a] font-bold">¥880</span></li>
                  <li className="flex justify-between"><span>グラスワイン(赤・白)</span><span className="text-[#deb55a] font-bold">¥1,000〜</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliated Store Section */}
      <section className="py-20 bg-cover bg-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&auto=format&q=80')` }}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-4 text-[#fcebc5]">Affiliated store of KABUKI SUSHI</h2>
          <p className="text-center text-xl mb-12 text-[#e8eaec]">姉妹店</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#271c02] rounded-lg p-6 border border-[#deb55a]/30">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1651977560790-42e0c5cf2ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&h=400&auto=format&q=80"
                alt="KABUKI寿司 本店"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#fcebc5]">■KABUKI寿司 本店</h3>
              <div className="space-y-2 text-[#e8eaec]">
                <p>〒160-0021 東京都新宿区歌舞伎町2丁目25-8 エコプレイス新宿1F</p>
                <p>TEL：03-6457-6612</p>
                <p>OPEN：18:00-4:00</p>
                <p>グルテンフリー対応可</p>
                <a href="https://site-1229809-8757-747.mystrikingly.com/" target="_blank" rel="noopener noreferrer" className="text-[#deb55a] hover:underline block mt-2">https://site-1229809-8757-747.mystrikingly.com/</a>
              </div>
            </div>

            <div className="bg-[#271c02] rounded-lg p-6 border border-[#deb55a]/30">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1651977560790-42e0c5cf2ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&h=400&auto=format&q=80"
                alt="KABUKI SOBA"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#fcebc5]">■KABUKI SOBA</h3>
              <div className="space-y-2 text-[#e8eaec]">
                <p>〒160-0021 東京都新宿区歌舞伎町２丁目２７ １２Lee２ビル １F</p>
                <p>TEL：03-6457-3112</p>
                <p>OPEN：19:00-6:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1C1C] text-[#e8eaec] py-8 border-t border-[#deb55a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p style={{ fontFamily: "'Bad Script', cursive" }} className="text-2xl mb-2 text-[#fcebc5]">KABUKI寿司 1番通り店</p>
          <p className="text-sm text-gray-400">© 2024 KABUKI Sushi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
