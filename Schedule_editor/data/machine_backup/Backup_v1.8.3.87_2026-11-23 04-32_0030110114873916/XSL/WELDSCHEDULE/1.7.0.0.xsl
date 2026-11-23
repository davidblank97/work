<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="sched/segment/pipe_diameter">
		<layer_diameter>
			<xsl:apply-templates select="@*|node()"/>
		</layer_diameter>
	</xsl:template>
	<xsl:template match="sched/global/pipe_diameter_edit_mode">
		<layer_diameter_edit_mode>
			<xsl:apply-templates select="@*|node()"/>
		</layer_diameter_edit_mode>
	</xsl:template>
	
	<xsl:template match="/sched/global/tungsten_centre_position_offset">
		<xsl:copy-of select="."/>
		<aux_0_pre_position>9999.0</aux_0_pre_position>
		<aux_1_pre_position>9999.0</aux_1_pre_position>
		<tilt_pre_position>9999.0</tilt_pre_position>
		<tilt_post_position>0</tilt_post_position>
	</xsl:template>
	
	

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>