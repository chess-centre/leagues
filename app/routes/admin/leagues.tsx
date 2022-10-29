import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import Button from "~/components/core/button";
import { LEAGUE_SCHEMA } from "~/db/schemas.server";
import Input from "~/components/core/input";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ErrorAlert from "~/components/core/alert/error";
import { AnimatePresence, motion } from "framer-motion";
import { createLeague, getLeagues } from "~/db/leagues.server";

type LoaderData = Awaited<ReturnType<typeof getLeagues>>;

export const loader: LoaderFunction = async () => {
  return getLeagues();
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const parsedInput = LEAGUE_SCHEMA.safeParse(values);

  if (!parsedInput.success) {
    const errors = parsedInput.error.errors.reduce((acc, { path, message }) => {
      return { ...acc, [path.join(".")]: message };
    }, {});
    return json({ errors, values });
  }

  const { data } = parsedInput;
  return createLeague({
    league: data,
    select: { id: true },
  });
};

export default function Leagues() {
  const formRef = useRef<HTMLFormElement>(null);
  const leagueName = useRef<HTMLInputElement>(null);
  const transition = useTransition();
  const leagues = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const isSubmitting = transition.state === "submitting";
  const isSubmitted = actionData?.id;

  useEffect(() => {
    if (isSubmitted) {
      formRef?.current?.reset();
      leagueName?.current?.focus();
      toast.success("Successfully added league");
    }
  }, [isSubmitted]);

  return (
    <div className="flex flex-wrap">
      <Form ref={formRef} method="post" className="w-full px-2 md:w-1/2">
        <fieldset disabled={transition.state === "submitting"}>
          <Input
            ref={leagueName}
            required
            label="League Name"
            name="name"
            defaultValue={actionData?.values?.name}
            error={actionData?.errors?.name}
          />

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </fieldset>
      </Form>

      <motion.div className="grow p-2 flex flex-col gap-2" layout>
        {leagues?.length ? (
          leagues.map((league) => (
            <AnimatePresence key={league.id} mode="popLayout">
              <motion.div
                className="shadow ring-1 ring-black ring-opacity-5 rounded-md p-2"
                whileHover={{ scale: 1.01 }}
              >
                {league.name}
              </motion.div>
            </AnimatePresence>
          ))
        ) : (
          <p>No leagues yet...</p>
        )}
      </motion.div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorAlert
      title="Error occurred in league form"
      detail={error.message}
    ></ErrorAlert>
  );
};
