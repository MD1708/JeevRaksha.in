
import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { UserProfile, AppState } from './types';
import { 
  Heart, 
  UserPlus, 
  QrCode, 
  Phone, 
  AlertCircle, 
  ChevronRight, 
  Download, 
  ShieldCheck,
  MapPin,
  ArrowLeft,
  Activity
} from 'lucide-react';
import { generateEmergencySummary } from './services/geminiService';

// QR Code component using simple canvas as we can't import external qrcode libs easily in this restricted environment without package.json control
const QRCodeMock: React.FC<{ data: string }> = ({ data }) => {
  return (
    <div className="bg-white p-4 border-2 border-gray-100 rounded-xl shadow-inner flex flex-col items-center">
      <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center p-4">
        {/* Placeholder for real QR code - in a real app use qrcode.react */}
        <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full opacity-90">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`}></div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400 font-mono break-all text-center">ID: {data}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>(AppState.HOME);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jeevraksha_profiles');
    if (saved) setProfiles(JSON.parse(saved));
    
    // Check if URL has a profile ID hash
    const hash = window.location.hash;
    if (hash.startsWith('#profile-')) {
      const id = hash.replace('#profile-', '');
      const found = JSON.parse(saved || '[]').find((p: UserProfile) => p.id === id);
      if (found) {
        setActiveProfile(found);
        setCurrentPage(AppState.PROFILE);
      }
    }
  }, []);

  const saveProfile = (profile: UserProfile) => {
    const updated = [...profiles, profile];
    setProfiles(updated);
    localStorage.setItem('jeevraksha_profiles', JSON.stringify(updated));
    setActiveProfile(profile);
    setCurrentPage(AppState.QR_VIEW);
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProfile: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: formData.get('fullName') as string,
      age: formData.get('age') as string,
      bloodGroup: formData.get('bloodGroup') as string,
      emergencyContact1Name: formData.get('contact1Name') as string,
      emergencyContact1Phone: formData.get('contact1Phone') as string,
      emergencyContact2Name: formData.get('contact2Name') as string,
      emergencyContact2Phone: formData.get('contact2Phone') as string,
      medicalConditions: formData.get('conditions') as string,
      allergies: formData.get('allergies') as string,
      address: formData.get('address') as string,
      createdAt: new Date().toISOString(),
    };
    saveProfile(newProfile);
  };

  const loadAiSummary = async (profile: UserProfile) => {
    setIsLoading(true);
    const summary = await generateEmergencySummary(profile);
    setAiSummary(summary);
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeProfile && currentPage === AppState.PROFILE) {
      loadAiSummary(activeProfile);
    }
  }, [activeProfile, currentPage]);

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3" onClick={() => setCurrentPage(AppState.HOME)}>
          <Logo size={32} />
          <div>
            <h1 className="font-bold text-xl text-slate-800 leading-none">JeevRaksha</h1>
            <p className="text-[10px] text-pink-600 font-semibold tracking-wider">BY MD CREATION</p>
          </div>
        </div>
        {currentPage !== AppState.HOME && (
          <button 
            onClick={() => setCurrentPage(AppState.HOME)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {currentPage === AppState.HOME && (
          <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative rounded-3xl overflow-hidden mb-8 h-48 shadow-lg">
              <img 
                src="https://picsum.photos/seed/safety/800/400" 
                alt="Social Welfare" 
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-white text-2xl font-bold">Safe Travels for Loved Ones</h2>
                <p className="text-gray-200 text-sm">Empowering seniors and students with digital identity.</p>
              </div>
            </div>

            <section className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCurrentPage(AppState.REGISTER)}
                  className="p-6 bg-blue-50 rounded-2xl flex flex-col items-center text-center space-y-3 border border-blue-100 transition-transform active:scale-95"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <UserPlus />
                  </div>
                  <span className="font-semibold text-blue-900">Register Profile</span>
                </button>
                <button 
                  onClick={() => setCurrentPage(AppState.SCAN)}
                  className="p-6 bg-pink-50 rounded-2xl flex flex-col items-center text-center space-y-3 border border-pink-100 transition-transform active:scale-95"
                >
                  <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <QrCode />
                  </div>
                  <span className="font-semibold text-pink-900">Scan QR</span>
                </button>
              </div>

              <div className="bg-white border rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <ShieldCheck className="text-green-500" /> Why JeevRaksha?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  In unfortunate events like road accidents, identifying an elderly person or a student without a mobile phone can be challenging for hospitals and police. 
                  Our QR system provides instant access to vital medical data and emergency contacts.
                </p>
              </div>

              {profiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider px-2">Your Saved Profiles</h3>
                  {profiles.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setActiveProfile(p);
                        setCurrentPage(AppState.QR_VIEW);
                      }}
                      className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                          {p.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{p.fullName}</p>
                          <p className="text-xs text-gray-500">Registered on {new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {currentPage === AppState.REGISTER && (
          <div className="p-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Identity Profile</h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Personal Details</h3>
                <div className="space-y-3">
                  <input required name="fullName" placeholder="Full Name" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input required name="age" type="number" placeholder="Age" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    <select required name="bloodGroup" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-pink-600 uppercase tracking-widest">Emergency Contacts</h3>
                <div className="space-y-3">
                  <input required name="contact1Name" placeholder="Primary Contact Name" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                  <input required name="contact1Phone" type="tel" placeholder="Primary Phone Number" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                  <input name="contact2Name" placeholder="Secondary Contact Name (Optional)" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                  <input name="contact2Phone" type="tel" placeholder="Secondary Phone Number (Optional)" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-widest">Medical Context</h3>
                <div className="space-y-3">
                  <textarea name="conditions" placeholder="Current Medical Conditions (Diabetes, Heart, etc.)" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none min-h-[100px]" />
                  <textarea name="allergies" placeholder="Any Allergies" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none min-h-[80px]" />
                  <textarea required name="address" placeholder="Residential Address" className="w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none min-h-[80px]" />
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-transform">
                Generate My QR Code
              </button>
            </form>
          </div>
        )}

        {currentPage === AppState.QR_VIEW && activeProfile && (
          <div className="p-6 flex flex-col items-center space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Your JeevRaksha QR</h2>
              <p className="text-gray-500">Print or save this QR code on a card or keychain.</p>
            </div>
            
            <QRCodeMock data={`JE-%20${activeProfile.id}`} />

            <div className="w-full space-y-4">
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-green-900 text-sm">Status: Active</h4>
                  <p className="text-green-700 text-xs">This QR will instantly show your emergency info when scanned by authorized personnel.</p>
                </div>
              </div>

              <button className="w-full py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50">
                <Download className="w-5 h-5" /> Download Digital Card
              </button>
            </div>
          </div>
        )}

        {currentPage === AppState.SCAN && (
          <div className="p-6 flex flex-col items-center space-y-6 animate-in fade-in duration-300">
            <div className="w-full aspect-square bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center border-4 border-slate-800">
              <QrCode className="w-32 h-32 text-slate-700" />
              <div className="absolute inset-x-8 top-1/2 h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"></div>
              <p className="absolute bottom-8 text-white/50 text-xs uppercase tracking-widest font-bold">Scanning...</p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-xl mb-2">Point at JeevRaksha QR</h3>
              <p className="text-sm text-gray-500">Scan the QR code on the individual's belongings to access emergency details.</p>
            </div>
            <div className="w-full space-y-3">
               <p className="text-xs text-gray-400 text-center italic">Demo Mode: Select a profile below to simulate a scan</p>
               {profiles.map(p => (
                 <button 
                  key={p.id}
                  onClick={() => {
                    setActiveProfile(p);
                    setCurrentPage(AppState.PROFILE);
                  }}
                  className="w-full p-3 bg-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                 >
                   Simulate Scan: {p.fullName}
                 </button>
               ))}
            </div>
          </div>
        )}

        {currentPage === AppState.PROFILE && activeProfile && (
          <div className="p-6 space-y-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {activeProfile.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{activeProfile.fullName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded uppercase">Blood: {activeProfile.bloodGroup}</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">Age: {activeProfile.age}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={120} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <AlertCircle size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Emergency AI Summary</span>
                </div>
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-200 font-medium italic">
                    "{aiSummary}"
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider border-b pb-2">
                  <Phone className="text-blue-500 w-4 h-4" /> Call Contacts
                </h3>
                <div className="space-y-3">
                  <a href={`tel:${activeProfile.emergencyContact1Phone}`} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl group hover:bg-blue-100 transition-colors">
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 uppercase">Primary Contact</p>
                      <p className="font-bold text-slate-900">{activeProfile.emergencyContact1Name}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md group-active:scale-90 transition-transform">
                      <Phone size={18} />
                    </div>
                  </a>
                  {activeProfile.emergencyContact2Phone && (
                    <a href={`tel:${activeProfile.emergencyContact2Phone}`} className="flex items-center justify-between p-3 bg-pink-50 rounded-xl group hover:bg-pink-100 transition-colors">
                      <div>
                        <p className="text-[10px] font-bold text-pink-600 uppercase">Secondary Contact</p>
                        <p className="font-bold text-slate-900">{activeProfile.emergencyContact2Name}</p>
                      </div>
                      <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white shadow-md group-active:scale-90 transition-transform">
                        <Phone size={18} />
                      </div>
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider border-b pb-2">
                  <MapPin className="text-red-500 w-4 h-4" /> Home Address
                </h3>
                <p className="text-slate-600 text-sm">{activeProfile.address}</p>
              </div>

              {(activeProfile.medicalConditions || activeProfile.allergies) && (
                <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider border-b pb-2">
                    <Heart className="text-pink-500 w-4 h-4" /> Medical Info
                  </h3>
                  <div className="space-y-3">
                    {activeProfile.medicalConditions && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Conditions</p>
                        <p className="text-slate-700 text-sm font-medium">{activeProfile.medicalConditions}</p>
                      </div>
                    )}
                    {activeProfile.allergies && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Allergies</p>
                        <p className="text-slate-700 text-sm font-medium">{activeProfile.allergies}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Persistent Bottom Nav (Quick Actions) */}
      <nav className="fixed bottom-0 w-full max-w-lg bg-white/80 backdrop-blur-xl border-t px-8 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setCurrentPage(AppState.HOME)}
          className={`flex flex-col items-center gap-1 ${currentPage === AppState.HOME ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-xl transition-colors ${currentPage === AppState.HOME ? 'bg-blue-100' : 'bg-transparent'}`}>
            <Heart size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        <button 
          onClick={() => setCurrentPage(AppState.REGISTER)}
          className={`flex flex-col items-center gap-1 ${currentPage === AppState.REGISTER ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-xl transition-colors ${currentPage === AppState.REGISTER ? 'bg-blue-100' : 'bg-transparent'}`}>
            <UserPlus size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Register</span>
        </button>
        <button 
          onClick={() => setCurrentPage(AppState.SCAN)}
          className={`flex flex-col items-center gap-1 ${currentPage === AppState.SCAN ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-xl transition-colors ${currentPage === AppState.SCAN ? 'bg-blue-100' : 'bg-transparent'}`}>
            <QrCode size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Scan</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
