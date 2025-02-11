from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from clients.models import User
from django.contrib import admin
from clients.models import Subscription

admin.site.register(Subscription)


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = [
        "username",
        "email",
        "date_birth",
        "first_name",
        "last_name",
        "photo",
    ]
    fieldsets = UserAdmin.fieldsets + ((None, {"fields": ("photo", "date_birth")}),)
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("photo", "date_birth")}),
    )


admin.site.register(User, CustomUserAdmin)
