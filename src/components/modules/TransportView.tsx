import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Bus,
  Plus,
  MapPin,
  Phone,
  User,
  Users,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { TransportVehicle, TransportRoute } from '../../types';

export const TransportView: React.FC = () => {
  const {
    currentUser,
    scopedVehicles,
    scopedRoutes,
    addVehicle,
    addRoute,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'routes' | 'fleet'>('routes');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);

  // Vehicle form
  const [vehicleNo, setVehicleNo] = useState('DL 01 AB 8842');
  const [driverName, setDriverName] = useState('Suresh Kumar');
  const [driverPhone, setDriverPhone] = useState('+91 98765 11223');
  const [capacity, setCapacity] = useState(42);

  // Route form
  const [routeName, setRouteName] = useState('Route 3 - South Enclave & Saket');
  const [vehicleId, setVehicleId] = useState(scopedVehicles[0]?.id || '');
  const [fare, setFare] = useState(1800);

  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal';

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo || !driverName || !driverPhone) {
      addToast('Please fill all vehicle details', 'error');
      return;
    }

    addVehicle({
      vehicleNumber: vehicleNo,
      driverName,
      driverPhone,
      capacity: Number(capacity) || 40,
      status: 'active',
    });

    setIsAddVehicleOpen(false);
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName || !vehicleId) {
      addToast('Please fill route name and assigned vehicle', 'error');
      return;
    }

    addRoute({
      name: routeName,
      vehicleId,
      stops: [
        { stopName: 'Saket Metro Station', pickupTime: '07:15 AM', dropTime: '03:15 PM' },
        { stopName: 'Malviya Nagar Block B', pickupTime: '07:30 AM', dropTime: '03:00 PM' },
        { stopName: 'Hauz Khas Market', pickupTime: '07:45 AM', dropTime: '02:45 PM' },
        { stopName: 'School Campus Gate 1', pickupTime: '08:00 AM', dropTime: '02:30 PM' },
      ],
      fare: Number(fare) || 1500,
    });

    setIsAddRouteOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            School Transport & Bus Fleet
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor GPS transit routes, school buses, stops, and driver directories
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'routes'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Transit Routes
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fleet'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Fleet Directory ({scopedVehicles.length})
            </button>
          </div>

          {canManage && (
            <button
              onClick={() => (activeTab === 'routes' ? setIsAddRouteOpen(true) : setIsAddVehicleOpen(true))}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{activeTab === 'routes' ? 'Add Route' : 'Add Bus'}</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'routes' ? (
        /* Routes List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scopedRoutes.map((route) => {
            const vehicle = scopedVehicles.find((v) => v.id === route.vehicleId);

            return (
              <div
                key={route.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                        <Bus className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-heading">
                          {route.name}
                        </h3>
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-mono font-bold mt-0.5">
                          Bus: {vehicle ? vehicle.vehicleNumber : 'Bus Unassigned'}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      ₹{route.fare}/mo
                    </span>
                  </div>

                  {/* Driver Details */}
                  {vehicle && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Designated Driver</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{vehicle.driverName}</span>
                      </div>
                      <a
                        href={`tel:${vehicle.driverPhone}`}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{vehicle.driverPhone}</span>
                      </a>
                    </div>
                  )}

                  {/* Stops Timeline */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Transit Stops ({route.stops.length} Designated Halts)
                    </span>

                    <div className="space-y-1.5 border-l-2 border-orange-500 ml-2 pl-3">
                      {route.stops.map((stop, idx) => (
                        <div key={idx} className="text-xs flex items-center justify-between">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {stop.stopName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {stop.pickupTime} / {stop.dropTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Fleet Directory */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scopedVehicles.map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-slate-900 dark:text-white text-base">
                  {v.vehicleNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {v.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{v.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{v.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seating Capacity:</span>
                  <span className="font-bold text-orange-600">{v.capacity} Seats</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        title="Register Fleet Vehicle"
        subtitle="Add school bus or van with driver details"
        maxWidth="md"
      >
        <form onSubmit={handleSaveVehicle} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Vehicle Registration Number *
            </label>
            <input
              type="text"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              placeholder="e.g. DL 01 AB 1234"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 uppercase font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Driver Name *
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Driver Name"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Driver Mobile *
              </label>
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="+91 98765 00000"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Seating Capacity (Passangers)
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddVehicleOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Register Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Route Modal */}
      <Modal
        isOpen={isAddRouteOpen}
        onClose={() => setIsAddRouteOpen(false)}
        title="Create Transit Route"
        subtitle="Designate stops, timings, and assigned bus"
        maxWidth="md"
      >
        <form onSubmit={handleSaveRoute} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Route Name *
            </label>
            <input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="e.g. Route 4 - Civil Lines to Model Town"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Assign Vehicle
              </label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
              >
                {scopedVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicleNumber} ({v.driverName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Monthly Fare (INR ₹)
              </label>
              <input
                type="number"
                value={fare}
                onChange={(e) => setFare(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddRouteOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Save Route
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
