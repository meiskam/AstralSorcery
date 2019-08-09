function initializeCoreMod() {
    return {
        'coremodmethod': {
            'target': {
                'type': 'METHOD',
                'name': 'net.minecraft.entity.LivingEntity',
                'methodName': 'getAttributes',
                'methodDesc': '()Lnet/minecraft/entity/ai/attributes/AbstractAttributeMap;'
            },
            'transformer': function(method) {
                print('[AstralSorcery] Adding \'set_player_field\' ASM patch...');

                var ASMAPI = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var aReturn = ASMAPI.findFirstInstructionAfter(method, Opcodes.ARETURN, 0);

                while (aReturn !== null) {
                    var prev = aReturn.getPrevious();

                    method.instructions.insert(prev, ASMAPI.buildMethodCall(
                        'hellfirepvp/astralsorcery/common/util/ASMHookEndpoint',
                        'markPlayer',
                        '(Lnet/minecraft/entity/ai/attributes/AbstractAttributeMap;Lnet/minecraft/entity/player/PlayerEntity;)Lnet/minecraft/entity/ai/attributes/AbstractAttributeMap;',
                        ASMAPI.MethodType.STATIC));
                    method.instructions.insert(prev, new VarInsnNode(Opcodes.ALOAD, 0));

                    aReturn = ASMAPI.findFirstInstructionAfter(method, Opcodes.ARETURN, aReturn.index + 3);
                }

                print('[AstralSorcery] Added \'set_player_field\' ASM patch!');
            }
        }
    }
}