<script setup>
import { ref } from 'vue';

const title = ref('Configuraciones');

// Form data for profile
const profileForm = ref({
	name: '',
	email: '',
	phone: ''
});

// Form data for password change
const passwordForm = ref({
	currentPassword: '',
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
</script>

<template>
	<h1>{{ title }}</h1>
	<div class="config-panel">
		<!-- Password Section -->
		<div class="config-section">
			<h2>Cambiar contraseña</h2>
			<form @submit.prevent="changePassword">
				<div class="form-group">
					<label for="currentPassword">Contraseña actual:</label>
					<input 
						type="password" 
						id="currentPassword" 
						v-model="passwordForm.currentPassword"
						required
					/>
				</div>
				
				<div class="form-group">
					<label for="newPassword">Nueva contraseña:</label>
					<input 
						type="password" 
						id="newPassword" 
						v-model="passwordForm.newPassword"
						required
						minlength="8"
					/>
				</div>
				
				<div class="form-group">
					<label for="confirmPassword">Confirmar nueva contraseña:</label>
					<input 
						type="password" 
						id="confirmPassword" 
						v-model="passwordForm.confirmPassword"
						required
					/>
				</div>
				
				<button type="submit" class="btn btn-outline-primary"><i class="bi bi-passport"></i> Cambiar contraseña</button>
			</form>
		</div>
	</div>
</template>

<style scoped>
.config-panel {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	max-width: 600px;
	margin: 0 auto;
	padding: 1rem;
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

.btn-primary {
	background-color: #007bff;
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
	transition: background-color 0.2s;
}

.btn-primary:hover {
	background-color: #0056b3;
}
</style>