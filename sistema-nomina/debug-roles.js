// DIAGNÓSTICO: Verificar roles en localStorage

console.log('🔍 DIAGNÓSTICO DE ROLES');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 1. Verificar lo que hay en localStorage
const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');
const role = localStorage.getItem('role');

console.log('📦 LocalStorage:');
console.log('  - Token:', token ? '✅ Existe' : '❌ No existe');
console.log('  - RefreshToken:', refreshToken ? '✅ Existe' : '❌ No existe');
console.log('  - Role:', role);
console.log('  - Role type:', typeof role);

// 2. Verificar el tipo de rol
if (role) {
  console.log('\n🔐 Análisis del Rol:');
  console.log('  - Valor original:', `"${role}"`);
  console.log('  - Minúsculas:', role.toLowerCase());
  console.log('  - ¿Es "admin"?', role.toLowerCase() === 'admin');
  console.log('  - ¿Es "rrhh"?', role.toLowerCase() === 'rrhh');
  console.log('  - ¿Es "usuario"?', role.toLowerCase() === 'usuario');
}

// 3. Simular comparación del RoleGuard
console.log('\n🛡️ Simulación RoleGuard:');
const allowedRoles = ['ADMIN', 'RRHH'];
const normalizedUserRole = role?.toLowerCase();
const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

console.log('  - Rol del usuario (normalizado):', normalizedUserRole);
console.log('  - Roles permitidos (normalizados):', normalizedAllowedRoles);
console.log('  - ¿Usuario es admin?', normalizedUserRole === 'admin');
console.log('  - ¿Rol está en lista permitida?', normalizedAllowedRoles.includes(normalizedUserRole || ''));
console.log('  - ¿Debería pasar el guard?', normalizedUserRole === 'admin' || normalizedAllowedRoles.includes(normalizedUserRole || ''));

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Diagnóstico completo');
