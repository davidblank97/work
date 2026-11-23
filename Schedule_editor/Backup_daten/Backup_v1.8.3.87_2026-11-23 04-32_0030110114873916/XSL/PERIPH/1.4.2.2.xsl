<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/peripheral/ports/ethernet/ip" >
		<xsl:choose>
			<xsl:when test="/peripheral/ports/ethernet/name = 'modbus_server'">
				<!-- DELETE ELEMENT -->
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/peripheral/ports/comport[@channel='4']" >
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="./name = 'SMART TRAK MFC'">
				<ethernet channel='1'>
					<name>modbus_server</name>
					<client>false</client>
					<port>502</port>
					<protocol>TCP</protocol>
					<unitid>1</unitid>
				</ethernet>
			</xsl:when>
			<xsl:otherwise>
				<!-- DO NOTHING -->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
