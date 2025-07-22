
export enum Permission {
    createDoctorPermission,
    updateDoctorPermission,
    deleteDoctorPermission,
    createPatientPermission,
    updatePatientPermission,
    deletePatientPermission,
}

const adminPermissions = [
    Permission.createPatientPermission,
    Permission.updatePatientPermission,
    Permission.deletePatientPermission,
];
const rootPermissions = [
    ...adminPermissions,
    Permission.createDoctorPermission,
    Permission.updateDoctorPermission,
    Permission.deleteDoctorPermission,
];

export const rolePermissionMap: { [key: string]: Permission[] } = {
    user: [],
    admin: adminPermissions,
    root: rootPermissions,
};