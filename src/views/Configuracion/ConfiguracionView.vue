<script setup>
import { onMounted, ref } from 'vue';
import api from '@/services/axios';

const title = ref('Configuraciones');
const activeTab = ref('usuarios');

// Form data for password change
const passwordForm = ref({
	currentPassword: '',
	newPassword: '',
	confirmPassword: ''
});

const users = ref([]);
const loadingUsers = ref(false);

const isUserModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const editingUserId = ref(null);
const targetExternalUser = ref(null);

const userForm = ref({
	nombre: '',
	user: '',
	perfil: 'agente',
	activo: true,
	password: ''
});

const externalPasswordForm = ref({
	newPassword: '',
	confirmPassword: ''
});

// Handle password change
const changePassword = () => {
	if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
		alert('Las contraseñas no coinciden');
		return;
	}
	console.log('Changing password:', passwordForm.value);
	// Here you would typically call an API to change the password
	alert('Contraseña cambiada correctamente');
};

const openCreateUserModal = () => {
	editingUserId.value = null;
	userForm.value = {
		nombre: '',
		user: '',
		perfil: 'counter',
		activo: true,
		password: ''
	};
	isUserModalOpen.value = true;
};

const openEditUserModal = (user) => {
	editingUserId.value = user.id;
	userForm.value = {
		nombre: user.nombre,
		user: user.user,
		perfil: user.perfil || 'counter',
		activo: user.activo ?? true,
		password: ''
	};
	isUserModalOpen.value = true;
};

const closeUserModal = () => {
	isUserModalOpen.value = false;
};

const listarUsuarios = async () => {
	loadingUsers.value = true;
	try {
		const response = await api.get('/usuarios');
		users.value = Array.isArray(response.data) ? response.data : [];
	} catch (error) {
		console.error(error);
		alert('No se pudo listar usuarios');
	} finally {
		loadingUsers.value = false;
	}
};

const saveUserApi = async () => {
	try {
		const payload = {
			nombre: userForm.value.nombre,
			user: userForm.value.user,
			perfil: userForm.value.perfil,
			activo: userForm.value.activo ? 1 : 0
		};

		if (!editingUserId.value || userForm.value.password) {
			payload.password = userForm.value.password;
		}

		if (!editingUserId.value && !payload.password) {
			alert('La clave es obligatoria para crear usuario');
			return;
		}

		if (editingUserId.value) {
			await api.put(`/usuarios/${editingUserId.value}`, payload);
			alert('Usuario actualizado correctamente');
		} else {
			await api.post('/usuarios', payload);
			alert('Usuario creado correctamente');
		}

		closeUserModal();
		await listarUsuarios();
	} catch (error) {
		console.error(error);
		alert('No se pudo guardar el usuario');
	}
};

const deleteUserApi = async (user) => {
	try {
		await api.delete(`/usuarios/${user.id}`);
		alert('Usuario eliminado');
		await listarUsuarios();
	} catch (error) {
		console.error(error);
		alert('No se pudo eliminar el usuario');
	}
};

const openExternalPasswordModal = (user) => {
	targetExternalUser.value = user;
	externalPasswordForm.value = { newPassword: '', confirmPassword: '' };
	isPasswordModalOpen.value = true;
};

const closeExternalPasswordModal = () => {
	isPasswordModalOpen.value = false;
	targetExternalUser.value = null;
};

const changeExternalUserPassword = async () => {
	if (!targetExternalUser.value) return;
	if (externalPasswordForm.value.newPassword !== externalPasswordForm.value.confirmPassword) {
		alert('Las contraseñas no coinciden');
		return;
	}
	if (externalPasswordForm.value.newPassword.length < 8) {
		alert('La contraseña debe tener al menos 8 caracteres');
		return;
	}

	console.log('Changing external user password:', {
		userId: targetExternalUser.value.id,
		newPassword: externalPasswordForm.value.newPassword
	});

	try {
		await api.put(`/usuarios/${targetExternalUser.value.id}`, {
			password: externalPasswordForm.value.newPassword
		});
		alert(`Clave actualizada para ${targetExternalUser.value.nombre}`);
		closeExternalPasswordModal();
		await listarUsuarios();
	} catch (error) {
		console.error(error);
		alert('No se pudo cambiar la clave');
	}
};

const saveUser = async () => {
	if (!userForm.value.nombre || !userForm.value.user) {
		alert('Completa nombre y usuario');
		return;
	}
	await saveUserApi();
};

const deleteUserAction = async (user) => {
	const shouldDelete = confirm(`¿Eliminar al usuario ${user.nombre}?`);
	if (!shouldDelete) return;
	await deleteUserApi(user);
};

onMounted(() => {
	listarUsuarios();
});
</script>

<template>
	<h1>{{ title }}</h1>
	<div class="config-panel">
		<div class="tabs-header">
			<button class="tab-btn" :class="{ active: activeTab === 'usuarios' }" @click="activeTab = 'usuarios'">
				Usuarios
			</button>
			<button class="tab-btn" :class="{ active: activeTab === 'password' }" @click="activeTab = 'password'">
				Contraseña
			</button>
		</div>

		<div class="config-section" v-if="activeTab === 'usuarios'">
			<div class="section-header">
				<h2>Usuarios</h2>
				<button class="btn btn-outline-primary" @click="openCreateUserModal">Nuevo usuario</button>
			</div>
			<table class="users-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Nombre</th>
						<th>Usuario</th>
						<th>Perfil</th>
						<th>Estado</th>
						<th>Tipo</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="loadingUsers">
						<td colspan="7">Cargando usuarios...</td>
					</tr>
					<tr v-else-if="users.length === 0">
						<td colspan="7">No hay usuarios registrados</td>
					</tr>
					<tr v-for="(user, index) in users" :key="user.id">
						<td>{{ index + 1 }}</td>
						<td>{{ user.nombre }}</td>
						<td>{{ user.user }}</td>
						<td>{{ user.perfil || '-' }}</td>
						<td>{{ user.activo ? 'Activo' : 'Inactivo' }}</td>
						<td>Interno</td>
						<td class="actions-cell">
							<button class="btn btn-outline-primary btn-sm" @click="openEditUserModal(user)">Editar</button>
							<button class="btn btn-outline-danger btn-sm" @click="deleteUserAction(user)">Eliminar</button>
							<button
								class="btn btn-outline-secondary btn-sm"
								@click="openExternalPasswordModal(user)"
							>
								Cambiar clave
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="config-section" v-if="activeTab === 'password'">
			<h2>Cambiar contraseña</h2>
			<form @submit.prevent="changePassword">
				<div class="form-group">
					<label for="currentPassword">Contraseña actual:</label>
					<input type="password" id="currentPassword" v-model="passwordForm.currentPassword" required />
				</div>
				<div class="form-group">
					<label for="newPassword">Nueva contraseña:</label>
					<input type="password" id="newPassword" v-model="passwordForm.newPassword" required minlength="8" />
				</div>
				<div class="form-group">
					<label for="confirmPassword">Confirmar nueva contraseña:</label>
					<input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword" required />
				</div>
				<button type="submit" class="btn btn-outline-primary"><i class="bi bi-passport"></i> Cambiar contraseña</button>
			</form>
		</div>
	</div>

	<div class="modal-backdrop" v-if="isUserModalOpen" @click.self="closeUserModal">
		<div class="modal-card">
			<h3>{{ editingUserId ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
			<form @submit.prevent="saveUser">
				<div class="form-group">
					<label for="userName">Nombre</label>
					<input id="userName" type="text" v-model="userForm.nombre" required />
				</div>
				<div class="form-group">
					<label for="username">Usuario</label>
					<input id="username" type="text" v-model="userForm.user" required />
				</div>
				<div class="form-group">
					<label for="userRole">Rol</label>
					<select id="userRole" v-model="userForm.perfil">
						<option value="administrador">Administrador</option>
					<option value="counter">Counter</option>
					<option value="logística">Logística</option>
					<option value="caja">Caja</option>
					</select>
				</div>
				<div class="form-group">
					<label for="userPassword">Clave {{ editingUserId ? '(opcional)' : '' }}</label>
					<input id="userPassword" type="password" v-model="userForm.password" :required="!editingUserId" minlength="5" />
				</div>
				<div class="modal-actions">
					<button type="button" class="btn btn-outline-secondary" @click="closeUserModal">Cancelar</button>
					<button type="submit" class="btn btn-outline-primary">Guardar</button>
				</div>
			</form>
		</div>
	</div>

	<div class="modal-backdrop" v-if="isPasswordModalOpen" @click.self="closeExternalPasswordModal">
		<div class="modal-card">
			<h3>Cambiar clave de {{ targetExternalUser?.nombre }}</h3>
			<form @submit.prevent="changeExternalUserPassword">
				<div class="form-group">
					<label for="extPassword">Nueva clave</label>
					<input id="extPassword" type="password" v-model="externalPasswordForm.newPassword" minlength="8" required />
				</div>
				<div class="form-group">
					<label for="extPasswordConfirm">Confirmar clave</label>
					<input id="extPasswordConfirm" type="password" v-model="externalPasswordForm.confirmPassword" required />
				</div>
				<div class="modal-actions">
					<button type="button" class="btn btn-outline-secondary" @click="closeExternalPasswordModal">Cancelar</button>
					<button type="submit" class="btn btn-outline-primary">Actualizar clave</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style scoped>
.config-panel {
	max-width: 960px;
	margin: 0 auto;
	padding: 1rem;
}

.tabs-header {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.tab-btn {
	border: 1px solid #cbd5e1;
	background: #fff;
	color: #334155;
	padding: 0.55rem 0.9rem;
	border-radius: 8px;
	cursor: pointer;
}

.tab-btn.active {
	background: #0d6efd;
	color: #fff;
	border-color: #0d6efd;
}

.config-section {
	background: #f8f9fa;
	border-radius: 8px;
	padding: 1.5rem;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.config-section h2 {
	margin-top: 0;
	color: #333;
}

.form-group {
	margin-bottom: 1rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: bold;
}

.form-group input {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 1rem;
	box-sizing: border-box;
}

.form-group input:focus {
	outline: none;
	border-color: #007bff;
	box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.form-group select {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 1rem;
	box-sizing: border-box;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.users-table {
	width: 100%;
	border-collapse: collapse;
	background: #fff;
}

.users-table th,
.users-table td {
	border: 1px solid #e2e8f0;
	padding: 0.65rem;
	text-align: left;
}

.actions-cell {
	display: flex;
	gap: 0.35rem;
	flex-wrap: wrap;
}

.btn-sm {
	padding: 0.35rem 0.55rem;
	font-size: 0.85rem;
}

.modal-backdrop {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.45);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
}

.modal-card {
	background: #fff;
	border-radius: 10px;
	width: 100%;
	max-width: 480px;
	padding: 1rem;
}

.modal-actions {
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	margin-top: 1rem;
}

.inline-group {
	display: flex;
	align-items: center;
	gap: 0.6rem;
}
</style>
