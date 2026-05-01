import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth';

import Dashboard from '@/views/Admin/Dashboard.vue'
import Login from '@/views/Admin/Login.vue'
import Signin from '@/views/Admin/Signin.vue'
import EventInput from '@/views/Admin/Announcements/EventInput.vue'
import AttendanceOverview from '@/views/Admin/AttendanceManagement/AttendanceOverview.vue'
import AttendanceLogs from '@/views/Admin/AttendanceManagement/AttendanceLogs.vue'
import ImportRecord from '@/views/Admin/AttendanceManagement/ImportRecord.vue'
import ManualInsert from '@/views/Admin/AttendanceManagement/ManualInsert.vue'
import AttendanceGeneral from '@/views/Admin/AttendanceManagement/AttendanceTabs/AttendanceGeneral.vue'
import AttendanceRanking from '@/views/Admin/AttendanceManagement/AttendanceTabs/AttendanceRanking.vue'
import AttendanceSearch from '@/views/Admin/AttendanceManagement/AttendanceTabs/AttendanceSearch.vue'
import SearchRecord from '@/views/Admin/AttendanceManagement/AttendanceTabs/SearchRecord.vue'
import VisitorAttendance from '@/views/Admin/AttendanceManagement/AttendanceTabs/VisitorAttendance.vue'
import UsersManagement from '@/views/Admin/AdminManagement/UsersManagement.vue'
import ActivateDeactivate from '@/views/Admin/AdminManagement/ActivateDeactivate.vue'
import ManageAssignation from '@/views/Admin/AdminManagement/ManageAssignation.vue'
import ManagePermission from '@/views/Admin/AdminManagement/ManagePermission.vue'
import ManageRoles from '@/views/Admin/AdminManagement/ManageRoles.vue'
import ViewUsers from '@/views/Admin/AdminManagement/ViewUsers.vue'
import BackupSettings from '@/views/Admin/AdminManagement/BackupSettings.vue'
import ReportPage from '@/views/Admin/Attendance/Reports/ReportPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.pBASE_URL),
  routes: [
    { path: '/', name: 'login', component: Login },
    { path: '/admin/signin', name: 'signin', component: Signin },

    //sidebars
    { path: '/admin', name: 'admin', component: Dashboard },
    { path: '/admin/event', name: 'event', component: EventInput  },
    { path: '/admin/attendance', name: 'attendance', component: AttendanceOverview  },
    { path: '/admin/attendance/logs', name: 'attendance-logs', component: AttendanceLogs  },
    { path: '/admin/attendance/import', name: 'attendance-import', component: ImportRecord  },
    { path: '/admin/attendance/import/add', name: 'attendance-add', component: ManualInsert  },
    { path: '/admin/attendance/settings', name: 'attendance-settings', component: AttendanceGeneral },
    { path: '/admin/attendance/report', name: 'attendance-report', component: ReportPage  },
    { path: '/admin/attendance/search', name: 'attendance-search', component: AttendanceSearch  },
    { path: '/admin/attendance/students', name: 'attendance-students', component: SearchRecord },
    { path: '/admin/attendance/ranking', name: 'attendance-ranking', component: AttendanceRanking  },
    { path: '/admin/attendance/visitors', name: 'admin-attendance-visitors', component: VisitorAttendance },
  
    { path: '/admin/management', name: 'admin-management', component: UsersManagement },
    { path: '/admin/management/view-users', name: 'admin-management-view', component: ViewUsers  },    
    { path: '/admin/management/activation', name: 'admin-management-activation', component: ActivateDeactivate  }, 
    { path: '/admin/management/roles', name: 'admin-management-roles', component: ManageRoles  }, 
    { path: '/admin/management/assignation', name: 'admin-management-assignation', component: ManageAssignation  }, 
    { path: '/admin/management/permission', name: 'admin-management-permission', component: ManagePermission  }, 
    { path: '/admin/settings/backup', name: 'admin-settings-backup', component: BackupSettings }, 
    { path: '/admin/attendance/report-test', name: 'attendance-report-test', component: ReportPage }, 
  ],
   scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to) => {
  const auth = useAuth()

  await auth.loadSession()

  const session = auth.session.value
  const profile = auth.profile.value

  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  // ✅ Not logged in
  if (requiresAuth && !session) {
    return '/admin/login'
  }

  // ✅ Prevent going back to login
  if ((to.path === '/admin/login' || to.path === '/admin/signin') && session) {
    return '/admin'
  }

  // ✅ RBAC (no infinite loop)
  if (requiresAdmin) {
    const isAdmin = profile?.role === 'admin'

    if (!isAdmin && !to.query.denied) {
      return {
        path: to.path,
        query: { ...to.query, denied: 'true' }
      }
    }
  }

  // ✅ allow navigation
  return true
})

export default router
