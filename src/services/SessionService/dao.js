module.exports = (db) => {
  const getActiveUser = (phone_number, t) =>
    t.oneOrNone(
      `
      select
        *
      from users
      where phone_number = $1 and is_active = true
      for update
    `,
      [phone_number]
    );

  const getValidOtp = (phone_number, t) =>
    t.oneOrNone(
      `
      select * from phone_number_otp
      where phone_number = $1
      and expires_at > now() and verified_at is null for update
    `,
      [phone_number]
    );

  const getUserFromSession = async (session_id) => {
    const user = await db.oneOrNone(
      `
        select
          u.user_id,
          u.full_name,
          u.phone,
          u.email,
          u.is_active,
          u.subs_type,
          s.id as session_id
        from (
          select * from active_sessions
          where id = $1
        ) s
        join users u
        on u.user_id = s.user_id
        where u.is_active = true
      `,
      session_id
    );

    return user;
  };

  const getOtp = (phone_number) =>
    db.tx(async (t) => {
      const otpExists = await getValidOtp(phone_number, t);

      if (otpExists) {
        return otpExists.otp;
      }

      const otp = Math.floor(1000 + Math.random() * 9000);

      await t.none(
        `
          insert into phone_number_otp
          (phone_number, otp, failed_attempts, expires_at)
          values
          ($1, $2, 0, now() + interval '10 minutes')
        `,
        [phone_number, otp]
      );

      return otp;
    });

  const verifyOtp = async (phone_number, otp) =>
    db.tx(async (t) => {
      const otpExists = await getValidOtp(phone_number, t);

      if (!otpExists) {
        return false;
      }

      if (otpExists.otp === otp) {
        await t.none(
          `
            update phone_number_otp
            set verified_at = now()
            where id = $1
          `,
          otpExists.id
        );

        await t.none(`
            update phone_number_otp
            set expires_at = now()
            where expires_at > now() and verified_at is null
          `);

        return true;
      }

      await t.none(
        `
          update phone_number_otp
          set
            failed_attempts = failed_attempts + 1,
            expires_at = case when failed_attempts > 3
              then now() else expires_at end
          where id = $1
        `,
        otpExists.id
      );

      return false;
    });

  const createSession = async (phone_number, device_id, user_agent) => {
    const session_id = await db.tx(async (t) => {
      const user = await getActiveUser(phone_number, t);

      console.log({ user });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const session = await t.one(
        `
          insert into sessions
          (id, user_id, device_id, user_agent, expires_at)
          values
          (
            uuid_generate_v4(),
            $1, $2, $3,
            now() + interval '1 month'
          )
          returning id;
        `,
        [user.user_id, device_id || null, user_agent || null]
      );

      console.log({ session });

      return session.id;
    });

    return session_id;
  };

  const logoutSessionById = (session_id) =>
    db.none(
      `
      update sessions set logged_out_at = now()
      where id = $1 and logged_out_at is null
    `,
      session_id
    );

  const logoutAllSessionsByUserId = (user_id) =>
    db.none(
      `
      update sessions set expires_at = now()
      where user_id = $1 and logged_out_at is null and expires_at > now()
    `,
      user_id
    );

  return {
    createSession,
    verifyOtp,
    getOtp,
    getUserFromSession,
    logoutSessionById,
    logoutAllSessionsByUserId,
  };
};
