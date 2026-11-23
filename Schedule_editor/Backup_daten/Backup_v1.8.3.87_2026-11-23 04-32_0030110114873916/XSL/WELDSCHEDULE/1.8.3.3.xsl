<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<xsl:template match="/sched/global/is_layer_diameter_pipe_touch_enabled">
		<xsl:copy-of select="."/>
		<residue_chipper_wire_speed>0</residue_chipper_wire_speed>
		<residue_chipper_wire_retract>0</residue_chipper_wire_retract>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>