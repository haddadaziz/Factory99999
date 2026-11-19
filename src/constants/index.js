// Rôles utilisateurs définis dans le backend FactoryFlow
export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator'
};

// Statuts des Ordres de Fabrication (OF)
export const ORDER_STATUS = {
  PLANIFIE: 'PLANIFIE',
  EN_COURS: 'EN_COURS',
  TERMINE: 'TERMINE',
  ANNULE: 'ANNULE'
};

// Types de mouvements de stock
export const MOVEMENT_TYPES = {
  ENTREE: 'ENTREE',
  SORTIE: 'SORTIE'
};

// Unités autorisées par l'API pour les matières premières
export const RAW_MATERIAL_UNITS = ['kg', 'g', 'L', 'ml', 'pièce', 'piece'];

// Clés de stockage local
export const STORAGE_KEYS = {
  TOKEN: 'factoryflow_token',
  USER: 'factoryflow_user'
};
