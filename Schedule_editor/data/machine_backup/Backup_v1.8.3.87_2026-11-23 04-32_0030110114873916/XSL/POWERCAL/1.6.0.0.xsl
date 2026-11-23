<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/cal/pilot" >
		<xsl:copy-of select="."/>
		<shield_gas>
			<gain>1</gain>
			<offset>0</offset>
			<tel_gain>1</tel_gain>
			<tel_offset>0</tel_offset>
		</shield_gas>
		<trail_gas>
			<gain>1</gain>
			<offset>0</offset>
			<tel_gain>1</tel_gain>
			<tel_offset>0</tel_offset>
		</trail_gas>
		<plasma_gas>
			<gain>1</gain>
			<offset>0</offset>
			<tel_gain>1</tel_gain>
			<tel_offset>0</tel_offset>
		</plasma_gas>
		<backup_gas>
			<gain>1</gain>
			<offset>0</offset>
			<tel_gain>1</tel_gain>
			<tel_offset>0</tel_offset>
		</backup_gas>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>