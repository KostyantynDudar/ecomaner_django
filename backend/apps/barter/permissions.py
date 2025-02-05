from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Разрешает изменять объект только его владельцу.
    Другим пользователям доступен только просмотр.
    """

    def has_object_permission(self, request, view, obj):
        # Разрешаем чтение всем (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Разрешаем изменение только владельцу объекта
        return obj.owner == request.user
