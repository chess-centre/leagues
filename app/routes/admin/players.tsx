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
import { PLAYER_SCHEMA } from "~/db/schemas.server";
import Input from "~/components/core/input";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ErrorAlert from "~/components/core/alert/error";
import { AnimatePresence, motion } from "framer-motion";
import { createPlayer, getPlayers } from "~/db/players.server";

type LoaderData = Awaited<ReturnType<typeof getPlayers>>;

export const loader: LoaderFunction = async () => {
  return getPlayers();
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const parsedInput = PLAYER_SCHEMA.safeParse(values);

  if (!parsedInput.success) {
    const errors = parsedInput.error.errors.reduce((acc, { path, message }) => {
      return { ...acc, [path.join(".")]: message };
    }, {});
    return json({ errors, values });
  }

  const { data } = parsedInput;
  return createPlayer({
    player: data,
    select: { id: true },
  });
};

export default function Players() {
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const transition = useTransition();
  const players = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const isSubmitting = transition.state === "submitting";
  const isSubmitted = actionData?.id;

  useEffect(() => {
    if (isSubmitted) {
      formRef?.current?.reset();
      firstNameRef?.current?.focus();
      toast.success("Successfully added person");
    }
  }, [isSubmitted]);

  return (
    <div className="flex flex-wrap">
      <Form ref={formRef} method="post" className="w-full px-2 md:w-1/2">
        <fieldset disabled={transition.state === "submitting"}>
          <Input
            ref={firstNameRef}
            required
            label="First Name"
            name="firstName"
            defaultValue={actionData?.values?.firstName}
            error={actionData?.errors?.firstName}
          />

          <Input
            label="Middle Name"
            name="middleName"
            defaultValue={actionData?.values?.middleName}
            error={actionData?.errors?.middleName}
          />

          <Input
            required
            label="Last Name"
            name="lastName"
            defaultValue={actionData?.values?.lastName}
            error={actionData?.errors?.lastName}
          />

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </fieldset>
      </Form>

      <motion.div className="grow p-2 flex flex-col gap-2" layout>
        {players?.length ? (
          players.map((player) => (
            <AnimatePresence key={player.id} mode="popLayout">
              <motion.div
                className="shadow ring-1 ring-black ring-opacity-5 rounded-md p-2"
                whileHover={{ scale: 1.01 }}
              >{`${player.firstName} ${player.lastName}`}</motion.div>
            </AnimatePresence>
          ))
        ) : (
          <p>No players...</p>
        )}
      </motion.div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorAlert
      title="Error occurred in player form"
      detail={error.message}
    ></ErrorAlert>
  );
};
