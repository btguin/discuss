'use server';

import type { Topic } from '@prisma/client'
import {revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { z } from 'zod';
import paths from '@/paths'
import { db } from '@/db';

const createTopicSchema = z.object({
    name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
         message: 'Must be lowercase letters or dashes without spaces'
        }),
        description: z.string().min(10),
});

interface CreateTopicFormState {
    errors: {
        name?: string[];
        description?: string[];
        _form?: string[];
        // _form to avoid accidental colliding with future field names - a form where one of the fields is called form. ? means it might be null
    }
}

export async function createTopic(
    formState: CreateTopicFormState, 
    formData: FormData
    ) : Promise<CreateTopicFormState> {

await new Promise(resolve => setTimeout(resolve, 2500));

const result = createTopicSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description')
});

if (!result.success) {
    return {
        errors: result.error.flatten().fieldErrors,
    }
}

const session = await auth();
if (!session || !session.user) {
    return {
        errors: {
            _form: ['You must be signed in to do this.'],
        },
    };
}

let topic: Topic;
try {
     topic = await db.topic.create({
            data: {
                slug: result.data.name,
                description: result.data.description
            }
        })

} catch (err:unknown) {
    if (err instanceof Error) {
        return{
            errors: {
                _form: [err.message]
            }
        }
    } else {
        return {
            errors: {
                _form: ['Something went wrong']
            }
        }
    }
}

revalidatePath('/')
redirect(paths.topicShow(topic.slug));
}