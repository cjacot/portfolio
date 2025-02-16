<template>
    <div class="formatted-content font-roboto">
        <template v-for="(block, index) in formattedBlocks" :key="index">
            <h2 v-if="block.type === 'title'" 
                class="text-[24px] font-light leading-[28px] text-black mb-4">
                {{ block.content }}
            </h2>
            <ul v-else-if="block.type === 'list'"
                class="text-[20px] font-light leading-[30px] text-black mb-4">
                <li v-for="(item, itemIndex) in block.items" 
                    :key="itemIndex"
                    class="flex items-start mb-2 last:mb-0">
                    <span class="mr-2">•</span>
                    <span class="flex-1">{{ item }}</span>
                </li>
            </ul>
            <p v-else 
               class="text-[20px] font-normal leading-[28px] text-black mb-4 whitespace-pre-line">
                {{ block.content }}
            </p>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    content: string
}>()

const formattedBlocks = computed(() => {
    return props.content.split('\n').reduce((blocks: any[], line: string) => {
        const trimmedLine = line.trim()
        
        // Skip empty lines but preserve paragraph breaks
        if (!trimmedLine) {
            if (blocks.length && blocks[blocks.length - 1].type === 'text') {
                blocks[blocks.length - 1].content += '\n\n'
            }
            return blocks
        }

        // Check for titles (##)
        if (trimmedLine.startsWith('##')) {
            blocks.push({
                type: 'title',
                content: trimmedLine.substring(2).trim()
            })
            return blocks
        }

        // Check for bullet points (- or *)
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            const listItem = trimmedLine.substring(2)
            
            // If the last block is a list, add to it
            if (blocks.length && blocks[blocks.length - 1].type === 'list') {
                blocks[blocks.length - 1].items.push(listItem)
            } else {
                // Create new list block
                blocks.push({
                    type: 'list',
                    items: [listItem]
                })
            }
            return blocks
        }

        // Handle regular text
        if (blocks.length && blocks[blocks.length - 1].type === 'text') {
            blocks[blocks.length - 1].content += '\n' + trimmedLine
        } else {
            blocks.push({
                type: 'text',
                content: trimmedLine
            })
        }

        return blocks
    }, [])
})
</script> 