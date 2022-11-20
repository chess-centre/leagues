import type { FormEvent } from "react";
import { useEffect, useRef } from "react";
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
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Button from "~/components/core/button";
import IconButton from "~/components/core/button/icon";
import { VENUE_SCHEMA } from "~/db/schemas.server";
import Input from "~/components/core/input";
import toast from "react-hot-toast";
import ErrorAlert from "~/components/core/alert/error";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { createVenue, deleteVenue, getVenues } from "~/db/venues.server";
import { FACILITIES } from "~/constants";
import CheckBox from "~/components/core/checkbox";
import VenueCard from "~/components/venue/card";

type LoaderData = {
  venues: Awaited<ReturnType<typeof getVenues>>;
};

export const loader: LoaderFunction = async () => {
  const venues = await getVenues();

  return json({ venues });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    case "delete":
      const deleteInput = z
        .object({
          venueId: z.number(),
        })
        .safeParse({
          ...values,
          ...(values?.venueId ? { venueId: Number(values.venueId) } : {}),
        });

      if (!deleteInput.success) {
        const errors = deleteInput.error.errors.reduce(
          (acc, { path, message }) => {
            return { ...acc, [path.join(".")]: message };
          },
          {}
        );
        return json({ errors, values });
      }

      const {
        data: { venueId },
      } = deleteInput;
      await deleteVenue({ venueId });

      return json({ result: "deleted" });

    case "create":
      const createInput = VENUE_SCHEMA.safeParse({
        ...values,
        ...(values?.selectedFacilities &&
        typeof values?.selectedFacilities === "string"
          ? {
              facilities: values.selectedFacilities
                .split(",")
                .map((facility) => ({ facility })),
            }
          : {}),
      });

      if (!createInput.success) {
        const errors = createInput.error.errors.reduce(
          (acc, { path, message }) => {
            return { ...acc, [path.join(".")]: message };
          },
          {}
        );
        return json({ errors, values });
      }

      const { data: venue } = createInput;

      await createVenue({
        venue,
        select: { id: true },
      });

      return json({ result: "created" });
    default:
      throw new Error("Unrecognised request");
  }
};

export default function Venues() {
  const formRef = useRef<HTMLFormElement>(null);
  const venueName = useRef<HTMLInputElement>(null);
  const transition = useTransition();
  const submit = useSubmit();
  const { venues } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const pendingAction =
    transition.state === "submitting" &&
    transition?.submission?.formData?.get("_action");
  const isSubmitting = !!pendingAction;
  const isSubmitted = actionData?.result;

  useEffect(() => {
    if (isSubmitted) {
      formRef?.current?.reset();
      venueName?.current?.focus();
      if (actionData?.result === "created") {
        toast.success("Successfully added venue");
      }
      if (actionData?.result === "deleted") {
        toast.success("Successfully deleted venue");
      }
    }
  }, [actionData?.result, isSubmitted]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const _action = (
      form.elements.namedItem("_action") as Element
    )?.getAttribute("value");
    formData.set("_action", _action || "");

    const localDate = formData.get("date");

    if (localDate && typeof localDate === "string") {
      const utcDate = new Date(localDate).toISOString();
      formData.set("date", utcDate);
    }

    const selectedFacilities = formData.getAll("facilities");
    formData.set("selectedFacilities", selectedFacilities.join(","));

    submit(formData, {
      method: "post",
    });
  };

  return (
    <div className="flex flex-wrap">
      <Form
        ref={formRef}
        method="post"
        className="w-full px-2 md:w-1/2"
        onSubmit={handleSubmit}
      >
        <fieldset disabled={isSubmitting}>
          <Input
            ref={venueName}
            required
            label="Name"
            name="name"
            type="text"
            defaultValue={actionData?.values?.name}
            error={actionData?.errors?.name}
          />

          <Input
            required
            label="Address"
            name="address"
            type="text"
            defaultValue={actionData?.values?.address}
            error={actionData?.errors?.address}
          />

          <Input
            required
            label="Town/City"
            name="city"
            type="text"
            defaultValue={actionData?.values?.city}
            error={actionData?.errors?.city}
          />

          <Input
            required
            label="Postcode"
            name="postcode"
            type="text"
            defaultValue={actionData?.values?.postcode}
            error={actionData?.errors?.postcode}
          />

          <Input
            label="Long"
            name="long"
            type="text"
            defaultValue={actionData?.values?.long}
            error={actionData?.errors?.long}
          />

          <Input
            label="Lat"
            name="lat"
            type="text"
            defaultValue={actionData?.values?.lat}
            error={actionData?.errors?.lat}
          />

          <Input
            label="Image Url"
            name="image"
            type="text"
            defaultValue={actionData?.values?.image}
            error={actionData?.errors?.image}
          />

          <span className="block font-medium text-gray-700">Facilities</span>
          {FACILITIES.map(({ label, value }) => {
            return (
              <CheckBox
                key={value}
                name="facilities"
                label={label}
                value={value}
              />
            );
          })}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={pendingAction === "create"}
              name="_action"
              value="create"
            >
              {pendingAction === "create" ? "Adding..." : "Add"}
            </Button>
          </div>
        </fieldset>
      </Form>

      <motion.div
        className="grow p-2 flex flex-col gap-2 w-full lg:w-[50%]"
        layout
      >
        {venues?.length ? (
          venues.map((venue) => (
            <AnimatePresence key={venue.id} mode="popLayout">
              <motion.div
                className="shadow ring-1 ring-black ring-opacity-5 rounded-md p-2"
                whileHover={{ scale: 1.01 }}
              >
                <Form method="post" className="w-full">
                  <fieldset
                    className="flex items-center justify-between"
                    disabled={isSubmitting}
                  >
                    <div className="flex flex-col">
                      <div>
                        <span className="font-bold">{venue.name}</span>
                      </div>
                    </div>
                    <Input type="hidden" name="venueId" value={venue.id} />
                    <IconButton
                      type="submit"
                      disabled={isSubmitting}
                      name="_action"
                      value="delete"
                      icon={<XMarkIcon className="h-6 w-6" />}
                      label={`Delete ${venue.name}`}
                    />
                  </fieldset>
                </Form>
              </motion.div>
              <VenueCard
                name={venue.name}
                address={venue.address}
                city={venue.city}
                postcode={venue.postcode}
                image={venue.image}
                location={{
                  long: venue.long,
                  lat: venue.lat,
                }}
                facilities={venue.facilities.map((facility) => ({
                  value: facility.facility,
                  description: facility.description,
                }))}
              />
            </AnimatePresence>
          ))
        ) : (
          <p>No venues yet...</p>
        )}
      </motion.div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorAlert
      title="Error occurred in venue form"
      detail={error.message}
    ></ErrorAlert>
  );
};
