<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/sched/global/wire_select_mode">
		<xsl:copy-of select="."/>
		<pulse_edit_mode>0</pulse_edit_mode>
	</xsl:template>
	
	<xsl:template match="/sched/overrides/tungsten_width_rate">
		<xsl:copy-of select="."/>
		<pulse_time_max>10</pulse_time_max>
		<pulse_time_rate>0.001</pulse_time_rate>
		<motion_pulse_time_max>10</motion_pulse_time_max>
		<motion_pulse_time_rate>0.001</motion_pulse_time_rate>
	</xsl:template>
		
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>