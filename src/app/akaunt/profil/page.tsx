import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-extrabold text-brand-navy-500">
          Лични данни
        </h2>
        <p className="mt-1 text-sm text-brand-navy-500/55">
          Имейл: {user.email}
        </p>

        <div className="mt-6">
          <ProfileForm
            firstName={user.firstName ?? ""}
            lastName={user.lastName ?? ""}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-extrabold text-brand-navy-500">
          Смяна на парола
        </h2>
        <p className="mt-1 text-sm text-brand-navy-500/55">
          Използвай поне 8 символа. След смяна другите ти активни сесии ще
          бъдат прекратени.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}
