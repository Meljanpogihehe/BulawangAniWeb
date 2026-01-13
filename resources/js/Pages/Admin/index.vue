<template>
  <AdminLayout>
    <router-view />
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/Components/AdminLayout.vue'

export default {
  name: 'AdminIndex',
  components: {
    AdminLayout
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #f8faf7, #f0f7ee);
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-header p {
  color: #5a6c5a;
  font-size: 1.1rem;
  font-weight: 600;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid #e8f1e1;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  border-color: #d4edda;
}

.stat-icon {
  font-size: 2.5rem;
  margin-right: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  color: #5a6c5a;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
}

.stat-value {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-actions {
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e8f1e1;
}

.dashboard-actions h2 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 800;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.action-btn {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(39, 174, 96, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .stat-icon {
    margin-right: 1rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>